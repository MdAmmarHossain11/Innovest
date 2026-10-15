from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient


class UserProfileUploadTests(TestCase):
    def test_dashboard_profile_photo_is_stored_with_blank_optional_dob(self):
        user = get_user_model().objects.create_user(
            email='profile-upload@example.com',
            password='StrongPass123!',
            first_name='Profile',
            last_name='Upload',
        )
        client = APIClient()
        client.force_authenticate(user)

        image_bytes = BytesIO()
        Image.new('RGB', (4, 3), color='green').save(image_bytes, format='PNG')
        image = SimpleUploadedFile(
            'profile.png',
            image_bytes.getvalue(),
            content_type='image/png',
        )

        with TemporaryDirectory() as media_root, override_settings(MEDIA_ROOT=media_root):
            response = client.put(
                '/api/settings/profile/',
                {
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'dob': '',
                    'profile_pic': image,
                },
                format='multipart',
            )

            self.assertEqual(response.status_code, 200, response.data)
            user.refresh_from_db()
            self.assertTrue(user.profile_pic.name)
            self.assertTrue(user.profile_pic.storage.exists(user.profile_pic.name))
