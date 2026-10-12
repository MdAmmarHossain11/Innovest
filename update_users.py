import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Innovest.settings')
django.setup()

from authentication.models import CustomUser

def update_users():
    # Get all users
    users = CustomUser.objects.all()
    print(f'Found {len(users)} users')
    
    # Update each user
    for user in users:
        # Print current state
        print(f"User {user.email} - is_active: {user.is_active}, email_verified: {user.email_verified}")
        
        # Update user
        user.is_active = True
        user.email_verified = True
        user.save()
        
        # Verify update
        print(f"Updated {user.email} - is_active: {user.is_active}, email_verified: {user.email_verified}")
    
    print("All users updated successfully")

if __name__ == '__main__':
    update_users() 