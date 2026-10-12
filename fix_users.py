import os
import django
import sqlite3

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Innovest.settings')
django.setup()

from django.conf import settings

def fix_users():
    # Get database path from Django settings
    db_path = settings.DATABASES['default']['NAME']
    print(f"Database path: {db_path}")
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # First, let's check the table structure
    cursor.execute("PRAGMA table_info(authentication_customuser)")
    columns = cursor.fetchall()
    print("Table columns:")
    for column in columns:
        print(column)
    
    # Now, let's see all users
    cursor.execute("SELECT id, email, is_active, is_staff, is_superuser FROM authentication_customuser")
    users = cursor.fetchall()
    print(f"\nFound {len(users)} users:")
    for user in users:
        print(f"User ID: {user[0]}, Email: {user[1]}, Active: {user[2]}, Staff: {user[3]}, Superuser: {user[4]}")
    
    # Update all users to be active
    cursor.execute("UPDATE authentication_customuser SET is_active = 1, email_verified = 1")
    conn.commit()
    print(f"\nUpdated {cursor.rowcount} users to active and verified")
    
    # Check if the update was successful
    cursor.execute("SELECT id, email, is_active, is_staff, is_superuser FROM authentication_customuser")
    updated_users = cursor.fetchall()
    print("\nUsers after update:")
    for user in updated_users:
        print(f"User ID: {user[0]}, Email: {user[1]}, Active: {user[2]}, Staff: {user[3]}, Superuser: {user[4]}")
    
    # Close the connection
    conn.close()
    print("\nDatabase connection closed")

if __name__ == '__main__':
    fix_users() 