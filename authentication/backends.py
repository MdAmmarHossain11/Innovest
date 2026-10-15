from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()

class EmailBackend(ModelBackend):
    """
    Custom authentication backend to authenticate with email and password.
    """
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        email_to_use = (email or username or '').strip()
        if not email_to_use or password is None:
            return None

        try:
            user = User.objects.get(email__iexact=email_to_use)
        except User.DoesNotExist:
            User().set_password(password)
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None