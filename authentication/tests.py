from io import BytesIO
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.test import override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase


class RegistrationEmailFailureTests(APITestCase):
    def test_email_failure_keeps_pending_account_and_retry_resends_email(self):
        payload = {
            'email': 'pending@example.com',
            'password': 'StrongPass123!',
            'password2': 'StrongPass123!',
            'first_name': 'Pending',
            'last_name': 'User',
        }

        with patch(
            'authentication.views.send_verification_email',
            side_effect=[OSError('SMTP is unavailable'), None],
        ) as send_email:
            failed_response = self.client.post(
                reverse('register'),
                payload,
                format='json',
            )

            self.assertEqual(
                failed_response.status_code,
                status.HTTP_503_SERVICE_UNAVAILABLE,
            )
            self.assertIn('account was created', failed_response.data['error'].lower())

            user = get_user_model().objects.get(email=payload['email'])
            self.assertFalse(user.email_verified)

            retry_response = self.client.post(
                reverse('register'),
                payload,
                format='json',
            )

        self.assertEqual(retry_response.status_code, status.HTTP_200_OK)
        self.assertIn('verification link has been sent', retry_response.data['message'].lower())
        self.assertEqual(send_email.call_count, 2)
        self.assertEqual(get_user_model().objects.filter(email=payload['email']).count(), 1)


class PlatformAdminAndProfileTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='platform-admin@example.com',
            password='StrongPass123!',
            first_name='Platform',
            last_name='Admin',
            user_type='user',
            is_superuser=True,
            is_staff=False,
        )

    def test_superuser_role_is_serialized_and_authorized_as_admin(self):
        login_response = self.client.post(
            reverse('login'),
            {'email': self.user.email, 'password': 'StrongPass123!'},
            format='json',
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertEqual(login_response.data['user']['user_type'], 'user')
        self.assertTrue(login_response.data['user']['is_superuser'])
        self.assertFalse(login_response.data['user']['is_staff'])

        self.client.force_authenticate(self.user)
        users_response = self.client.get(reverse('user-list'))
        self.assertEqual(users_response.status_code, status.HTTP_200_OK)

    def test_profile_image_upload_is_saved_to_user_record_and_storage(self):
        image_bytes = BytesIO()
        Image.new('RGB', (4, 3), color='blue').save(image_bytes, format='PNG')
        image = SimpleUploadedFile(
            'profile.png',
            image_bytes.getvalue(),
            content_type='image/png',
        )
        self.client.force_authenticate(self.user)

        with TemporaryDirectory() as media_root, override_settings(MEDIA_ROOT=media_root):
            response = self.client.patch(
                reverse('user-profile-update'),
                {'profile_pic': image},
                format='multipart',
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.user.refresh_from_db()
            self.assertTrue(self.user.profile_pic.name)
            self.assertTrue(self.user.profile_pic.storage.exists(self.user.profile_pic.name))

    def test_profile_update_cannot_grant_admin_role(self):
        regular_user = get_user_model().objects.create_user(
            email='regular@example.com',
            password='StrongPass123!',
            first_name='Regular',
            last_name='User',
        )
        self.client.force_authenticate(regular_user)

        response = self.client.patch(
            reverse('user-profile-update'),
            {'user_type': 'admin', 'is_superuser': True},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        regular_user.refresh_from_db()
        self.assertEqual(regular_user.user_type, 'user')
        self.assertFalse(regular_user.is_superuser)
