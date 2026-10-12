from django.shortcuts import render
from rest_framework import viewsets, permissions, status, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ChatMessage, ChatRequest
from .serializers import ChatMessageSerializer, UserSerializer, ChatRequestSerializer
from django.db import models
import logging
from django.db.models import Q
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        ).order_by('timestamp')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        try:
            logger.info(f"Marking message {pk} as read")
            message = self.get_object()
            if message.receiver == request.user:
                message.is_read = True
                message.save()
                logger.info(f"Message {pk} marked as read")
                return Response({'status': 'success'})
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            logger.error(f"Error in mark_as_read endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['delete'])
    def delete_message(self, request, pk=None):
        try:
            message = self.get_object()
            # Only allow sender to delete the message
            if message.sender != request.user:
                return Response(
                    {'error': 'Only the sender can delete this message'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Update message instead of deleting
            message.message = f'This message was deleted by {request.user.first_name or request.user.email.split("@")[0]}'
            # Remove file reference
            message.file = None
            message.save()
            
            serializer = self.get_serializer(message)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in delete_message endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UsersView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            logger.info(f"Fetching users for {request.user.email}")
            users = User.objects.exclude(id=request.user.id).exclude(user_type='admin')
            logger.info(f"Found {users.count()} users")
            
            # Log first few users for debugging
            for user in users[:3]:
                logger.debug(f"User: {user.email}, Name: {user.first_name} {user.last_name}")
                logger.debug(f"Profile pic exists: {hasattr(user, 'profile_pic')}")
                if hasattr(user, 'profile_pic'):
                    logger.debug(f"Profile pic value: {user.profile_pic}")
                    logger.debug(f"Profile pic URL: {user.profile_pic.url if user.profile_pic else None}")
            
            return Response([{
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'title': user.title if hasattr(user, 'title') else None,
                'profile_pic': (
                    user.profile_pic.url if hasattr(user, 'profile_pic') and user.profile_pic else
                    None
                )
            } for user in users])
        except Exception as e:
            logger.error(f"Error in users endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ConversationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user_id = request.query_params.get('user_id')
            logger.info(f"Fetching conversation between {request.user.email} and user {user_id}")
            
            # Ensure user_id is provided
            if not user_id:
                return Response(
                    {'error': 'User ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the other user
            try:
                other_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get messages where current user is either sender or receiver
            # and the other user is the selected user
            messages = ChatMessage.objects.filter(
                (Q(sender=request.user, receiver=other_user) |
                 Q(sender=other_user, receiver=request.user))
            ).order_by('timestamp')
            
            logger.info(f"Found {messages.count()} messages between {request.user.email} and {other_user.email}")
            
            # Mark unread messages as read
            unread_messages = messages.filter(
                receiver=request.user,
                is_read=False
            )
            if unread_messages.exists():
                unread_messages.update(is_read=True)
                logger.info(f"Marked {unread_messages.count()} messages as read")
            
            serializer = ChatMessageSerializer(messages, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in conversation endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SendMessageView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Only allow sending if request is accepted
        receiver_id = request.data.get('receiver')
        if not receiver_id:
            return Response({'error': 'Receiver is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            chat_request = ChatRequest.objects.get(from_user=request.user, to_user_id=receiver_id, status='accepted')
        except ChatRequest.DoesNotExist:
            try:
                chat_request = ChatRequest.objects.get(from_user_id=receiver_id, to_user=request.user, status='accepted')
            except ChatRequest.DoesNotExist:
                return Response({'error': 'Messaging not allowed. Request not accepted.'}, status=status.HTTP_403_FORBIDDEN)
        message = request.data.get('message', '')
        file = request.FILES.get('file')
        chat_message = ChatMessage.objects.create(
            sender=request.user,
            receiver_id=receiver_id,
            message=message,
            file=file
        )
        serializer = ChatMessageSerializer(chat_message, context={'request': request})
        return Response(serializer.data)

class ChatRequestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Requests sent or received by the user
        sent = ChatRequest.objects.filter(from_user=request.user)
        received = ChatRequest.objects.filter(to_user=request.user)
        serializer = ChatRequestSerializer(list(sent) + list(received), many=True)
        return Response(serializer.data)

    def post(self, request):
        # Get the URL path to determine which action to take
        path = request.path_info.split('/')[-2]  # Get the second-to-last part of the URL
        
        if path == 'my_requests':
            # Handle GET request for my_requests
            sent = ChatRequest.objects.filter(from_user=request.user)
            received = ChatRequest.objects.filter(to_user=request.user)
            serializer = ChatRequestSerializer(list(sent) + list(received), many=True)
            return Response(serializer.data)
            
        elif path == 'send_request':
            # Handle sending a new request
            to_user_id = request.data.get('to_user')
            if not to_user_id:
                return Response({'error': 'to_user is required'}, status=status.HTTP_400_BAD_REQUEST)
            if int(to_user_id) == request.user.id:
                return Response({'error': 'Cannot send request to yourself'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for existing request in either direction
            obj = ChatRequest.objects.filter(
                (Q(from_user=request.user, to_user_id=to_user_id) | Q(from_user_id=to_user_id, to_user=request.user))
            ).first()
            
            if obj:
                if obj.status == 'pending':
                    return Response({'error': 'Request already pending'}, status=status.HTTP_400_BAD_REQUEST)
                elif obj.status == 'rejected':
                    # Update direction and status
                    obj.from_user = request.user
                    obj.to_user_id = to_user_id
                    obj.status = 'pending'
                    obj.responded_at = None
                    obj.save()
            else:
                obj = ChatRequest.objects.create(from_user=request.user, to_user_id=to_user_id, status='pending')
            
            serializer = ChatRequestSerializer(obj)
            return Response(serializer.data)
            
        elif path == 'respond_request':
            # Handle responding to a request
            req_id = request.data.get('request_id')
            action = request.data.get('action_type')  # 'accept' or 'reject'
            
            if not req_id or action not in ['accept', 'reject']:
                return Response({'error': 'request_id and valid action required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                chat_request = ChatRequest.objects.get(id=req_id, to_user=request.user)
            except ChatRequest.DoesNotExist:
                return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
            
            chat_request.status = 'accepted' if action == 'accept' else 'rejected'
            chat_request.responded_at = timezone.now()
            chat_request.save()
            
            serializer = ChatRequestSerializer(chat_request)
            return Response(serializer.data)
            
        else:
            return Response({'error': 'Invalid endpoint'}, status=status.HTTP_400_BAD_REQUEST)
