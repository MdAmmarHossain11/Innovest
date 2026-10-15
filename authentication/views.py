from rest_framework import status, views, generics, permissions, filters
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import signing
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings
from .serializers import UserSerializer, UserRegistrationSerializer
import uuid
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
import logging
from django.utils import timezone

logger = logging.getLogger(__name__)

User = get_user_model()
PASSWORD_RESET_SALT = 'authentication.password-reset'
PASSWORD_RESET_MAX_AGE = 60 * 60


def send_verification_email(user):
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{user.verification_token}"
    send_mail(
        'Verify your email address',
        f'Please click the following link to verify your email: {verification_url}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


def send_password_reset_email(user, token):
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
    send_mail(
        'Password Reset Request',
        f'Click the following link to reset your password: {reset_url}',
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).strip().lower()
        existing_user = User.objects.filter(email__iexact=email).first()

        if existing_user and not existing_user.email_verified:
            existing_user.verification_token = uuid.uuid4()
            existing_user.save(update_fields=['verification_token'])
            try:
                send_verification_email(existing_user)
            except Exception:
                logger.exception('Unable to resend verification email to %s', existing_user.email)
                return Response({
                    'error': 'Unable to send the verification email. Please try again later.'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            return Response({
                'message': 'A new verification link has been sent to your email address.'
            }, status=status.HTTP_200_OK)
        if existing_user:
            return Response({
                'email': ['An account with this email address already exists.']
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            try:
                send_verification_email(user)
            except Exception:
                logger.exception('Unable to send verification email to %s', user.email)
                return Response({
                    'error': (
                        'Your account was created, but we could not send the verification email. '
                        'Please try registering with the same email again later or contact support.'
                    )
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
            return Response({
                'message': 'Registration successful. Please check your email to verify your account.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(views.APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            user = User.objects.get(verification_token=token)
            if not user.email_verified:
                user.email_verified = True
                user.is_active = True
                user.save()
                return Response({
                    'message': 'Email verification successful. You can now log in.'
                }, status=status.HTTP_200_OK)
            return Response({
                'message': 'Email already verified.'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid verification token.'
            }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).strip().lower()
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'error': 'Email and password are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password):
            return Response({
                'error': 'Invalid email or password.'
            }, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response({
                'error': 'Your account is inactive. Please contact support.'
            }, status=status.HTTP_400_BAD_REQUEST)
        if not user.email_verified:
            return Response({
                'error': 'Please verify your email before logging in.'
            }, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class ForgotPasswordView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).strip().lower()
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response({
                'message': 'If an account exists for that email, a password reset link will be sent.'
            }, status=status.HTTP_200_OK)

        reset_nonce = uuid.uuid4()
        signed_token = signing.dumps(str(reset_nonce), salt=PASSWORD_RESET_SALT)
        user.reset_token = reset_nonce
        user.save(update_fields=['reset_token'])
        try:
            send_password_reset_email(user, signed_token)
        except Exception:
            user.reset_token = None
            user.save(update_fields=['reset_token'])
            logger.exception('Unable to send password reset email.')
            return Response({
                'error': 'Unable to send the password reset email. Please try again later.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({
            'message': 'If an account exists for that email, a password reset link will be sent.'
        }, status=status.HTTP_200_OK)

class ResetPasswordView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        try:
            reset_nonce = signing.loads(
                token,
                salt=PASSWORD_RESET_SALT,
                max_age=PASSWORD_RESET_MAX_AGE,
            )
        except (signing.BadSignature, signing.SignatureExpired):
            return Response({
                'error': 'Invalid or expired reset token.'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(reset_token=reset_nonce).first()
        if not user:
            return Response({
                'error': 'Invalid or expired reset token.'
            }, status=status.HTTP_400_BAD_REQUEST)

        password = request.data.get('password')
        password2 = request.data.get('password2')
        if not password or password != password2:
            return Response({
                'error': 'Passwords do not match or are missing.'
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(password, user)
        except ValidationError as error:
            return Response({
                'password': error.messages
            }, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.reset_token = None
        user.save()
        return Response({
            'message': 'Password has been reset successfully.'
        }, status=status.HTTP_200_OK)
class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({'message': 'Account deleted successfully.'}, status=204)

class AdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_platform_admin

class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class AdminActivityLog:
    @staticmethod
    def log_activity(user, action, details):
        logger.info(f"Admin Action - User: {user.email}, Action: {action}, Details: {details}, Time: {timezone.now()}")

class UserManagementView(views.APIView):
    permission_classes = [AdminPermission]
    pagination_class = UserPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name', 'user_type']
    ordering_fields = ['email', 'created_at', 'user_type']

    def get(self, request):
        try:
            # Get query parameters
            search = request.query_params.get('search', '')
            user_type = request.query_params.get('user_type', '')
            is_active = request.query_params.get('is_active', None)
            
            # Base queryset
            queryset = User.objects.all()
            
            # Apply filters
            if search:
                queryset = queryset.filter(
                    models.Q(email__icontains=search) |
                    models.Q(first_name__icontains=search) |
                    models.Q(last_name__icontains=search)
                )
            if user_type:
                queryset = queryset.filter(user_type=user_type)
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active)

            # Apply pagination
            paginator = self.pagination_class()
            paginated_users = paginator.paginate_queryset(queryset, request)
            
            serializer = UserSerializer(paginated_users, many=True)
            
            AdminActivityLog.log_activity(
                request.user,
                'VIEW_USERS',
                f"Viewed users list with filters: {request.query_params}"
            )
            
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            logger.error(f"Error in user management view: {str(e)}")
            return Response({
                'error': 'An error occurred while fetching users'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                AdminActivityLog.log_activity(
                    request.user,
                    'UPDATE_USER',
                    f"Updated user {user.email}"
                )
                return Response(serializer.data)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating user: {str(e)}")
            return Response({
                'error': 'An error occurred while updating the user'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            email = user.email  # Store email before deletion
            user.delete()
            
            AdminActivityLog.log_activity(
                request.user,
                'DELETE_USER',
                f"Deleted user {email}"
            )
            
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting user: {str(e)}")
            return Response({
                'error': 'An error occurred while deleting the user'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            # Handle batch operations
            operation = request.data.get('operation')
            user_ids = request.data.get('user_ids', [])
            
            if not user_ids:
                return Response({
                    'error': 'No users selected'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            if operation == 'activate':
                User.objects.filter(id__in=user_ids).update(is_active=True)
                action_desc = "activated"
            elif operation == 'deactivate':
                User.objects.filter(id__in=user_ids).update(is_active=False)
                action_desc = "deactivated"
            elif operation == 'delete':
                User.objects.filter(id__in=user_ids).delete()
                action_desc = "deleted"
            else:
                return Response({
                    'error': 'Invalid operation'
                }, status=status.HTTP_400_BAD_REQUEST)
                
            AdminActivityLog.log_activity(
                request.user,
                f'BATCH_{operation.upper()}',
                f"Batch {action_desc} users: {user_ids}"
            )
            
            return Response({
                'message': f'Successfully {action_desc} {len(user_ids)} users'
            })
            
        except Exception as e:
            logger.error(f"Error in batch operation: {str(e)}")
            return Response({
                'error': 'An error occurred during the batch operation'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
