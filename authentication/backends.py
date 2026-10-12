from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()

class EmailBackend(ModelBackend):
    """
    Custom authentication backend to authenticate with email and password.
    """
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        # If email is not provided, try using username as email
        email_to_use = email or username
        
        print(f"EmailBackend: Authenticating with email: {email_to_use}")
        
        if email_to_use is None or password is None:
            print("EmailBackend: Email or password is None")
            return None
            
        try:
            # Try to fetch the user by email
            user = User.objects.get(email=email_to_use)
            print(f"EmailBackend: Found user: {user.email}")
            
            # Check if the user has a valid password
            password_valid = user.check_password(password)
            print(f"EmailBackend: Password valid: {password_valid}")
            
            # Check if user can authenticate
            can_authenticate = self.user_can_authenticate(user)
            print(f"EmailBackend: User can authenticate: {can_authenticate}")
            
            # Check if the user has a valid password and is allowed to authenticate
            if password_valid and can_authenticate:
                print(f"EmailBackend: Authentication successful for {user.email}")
                return user
            else:
                print(f"EmailBackend: Authentication failed for {user.email} - password valid: {password_valid}, can authenticate: {can_authenticate}")
                return None
        except User.DoesNotExist:
            print(f"EmailBackend: No user found with email: {email_to_use}")
            # Run the default password hasher to reduce timing attacks.
            User().set_password(password)
            return None
        except Exception as e:
            print(f"EmailBackend: Error during authentication: {str(e)}")
            return None 