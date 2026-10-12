from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from authentication.models import CustomUser
from .serializers import UserProfileSerializer
from django.contrib.auth.hashers import check_password
import logging
import traceback

logger = logging.getLogger(__name__)

# Create your views here.

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in GET profile: {str(e)}")
            logger.error(traceback.format_exc())
            return Response(
                {"detail": "Error fetching profile"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            user = request.user
            logger.info(f"Updating profile for user {user.id}")
            logger.info(f"Received data: {request.data}")
            
            # Log the current user data before update
            logger.info(f"Current user data: {UserProfileSerializer(user).data}")
            
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                logger.info("Serializer is valid, saving data")
                serializer.save()
                logger.info(f"Profile updated successfully for user {user.id}")
                logger.info(f"Updated user data: {serializer.data}")
                return Response(serializer.data)
            
            logger.error(f"Validation errors: {serializer.errors}")
            return Response({
                "detail": "Validation error",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error in PUT profile: {str(e)}")
            logger.error(traceback.format_exc())
            return Response(
                {"detail": f"Error updating profile: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')

            # Validate required fields
            if not all([old_password, new_password, confirm_password]):
                return Response(
                    {"detail": "All fields are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if old password matches
            if not check_password(old_password, user.password):
                return Response(
                    {"detail": "Old password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if new passwords match
            if new_password != confirm_password:
                return Response(
                    {"detail": "New passwords do not match"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update password
            user.set_password(new_password)
            user.save()

            return Response(
                {"detail": "Password changed successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Error in password change: {str(e)}")
            logger.error(traceback.format_exc())
            return Response(
                {"detail": "Error changing password"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
