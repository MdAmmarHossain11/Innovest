from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework.decorators import action
from django.db import IntegrityError
from django.core.exceptions import ValidationError

User = get_user_model()

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='check-email/(?P<email>[^/.]+)')
    def check_email(self, request, email=None):
        try:
            exists = User.objects.filter(email=email).exists()
            return Response({'exists': exists})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        try:
            # Check if user is admin
            if request.user.user_type != 'admin':
                return Response({
                    'detail': 'Only admin users can create new users'
                }, status=status.HTTP_403_FORBIDDEN)

            # Check if email already exists
            email = request.data.get('email')
            if User.objects.filter(email=email).exists():
                return Response({
                    'detail': 'A user with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create user
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                try:
                    user = serializer.save()
                    return Response({
                        'user': self.get_serializer(user).data,
                        'message': 'User created successfully'
                    }, status=status.HTTP_201_CREATED)
                except ValidationError as e:
                    return Response({
                        'detail': str(e)
                    }, status=status.HTTP_400_BAD_REQUEST)
                except IntegrityError as e:
                    return Response({
                        'detail': 'Database error occurred',
                        'error': str(e)
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'detail': 'Invalid data provided',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'detail': 'An error occurred while creating the user',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            # Check if user is admin
            if request.user.user_type != 'admin':
                return Response({
                    'detail': 'Only admin users can update users'
                }, status=status.HTTP_403_FORBIDDEN)

            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            
            if serializer.is_valid():
                try:
                    user = serializer.save()
                    return Response(serializer.data)
                except ValidationError as e:
                    return Response({
                        'detail': str(e),
                        'errors': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                except IntegrityError as e:
                    return Response({
                        'detail': 'Database error occurred',
                        'error': str(e)
                    }, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Log validation errors for debugging
                print("Validation errors:", serializer.errors)
                return Response({
                    'detail': 'Invalid data provided',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Update error:", str(e))
            return Response({
                'detail': 'An error occurred while updating the user',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            print("User data being returned:", serializer.data)  # Debug print
            return Response(serializer.data)
        except Exception as e:
            print("List error:", str(e))  # Debug print
            return Response({
                'detail': 'An error occurred while fetching users',
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
