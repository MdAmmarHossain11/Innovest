from io import BytesIO
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from django.core import signing
from django.core.mail import EmailMessage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.http import Http404
from django.test import RequestFactory
from django.urls import reverse
from django.test import override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase
from Innovest.urls import public_uploaded_image


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

    def test_existing_email_retry_is_case_insensitive(self):
        user = get_user_model().objects.create_user(
            email='pending@example.com',
            password='StrongPass123!',
            first_name='Pending',
            last_name='User',
            email_verified=False,
        )

        with patch('authentication.views.send_verification_email') as send_email:
            response = self.client.post(
                reverse('register'),
                {
                    'email': ' PENDING@EXAMPLE.COM ',
                    'password': 'StrongPass123!',
                    'password2': 'StrongPass123!',
                },
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        send_email.assert_called_once_with(user)
        self.assertEqual(get_user_model().objects.filter(email__iexact=user.email).count(), 1)

    def test_registered_email_cannot_be_registered_again_with_different_case(self):
        get_user_model().objects.create_user(
            email='registered@example.com',
            password='StrongPass123!',
            first_name='Registered',
            last_name='User',
        )

        response = self.client.post(
            reverse('register'),
            {
                'email': 'REGISTERED@example.com',
                'password': 'StrongPass123!',
                'password2': 'StrongPass123!',
                'first_name': 'Registered',
                'last_name': 'User',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


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

    def test_login_accepts_mixed_case_email_and_whitespace(self):
        response = self.client.post(
            reverse('login'),
            {'email': ' PLATFORM-ADMIN@EXAMPLE.COM ', 'password': 'StrongPass123!'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], self.user.email)

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


class PasswordRecoveryTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='password-reset@example.com',
            password='StrongPass123!',
            first_name='Password',
            last_name='Reset',
        )

    def test_forgot_password_sends_production_frontend_link_and_reset_is_one_time(self):
        with patch('authentication.views.send_password_reset_email') as send_email:
            response = self.client.post(
                reverse('forgot-password'),
                {'email': ' PASSWORD-RESET@EXAMPLE.COM '},
                format='json',
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            send_email.assert_called_once()

            sent_user, signed_token = send_email.call_args.args
            self.assertEqual(sent_user, self.user)
            self.user.refresh_from_db()
            self.assertEqual(
                signing.loads(signed_token, salt='authentication.password-reset', max_age=3600),
                str(self.user.reset_token),
            )
            reset_response = self.client.post(
                reverse('reset-password', kwargs={'token': signed_token}),
                {
                    'password': 'AnotherStrong123!',
                    'password2': 'AnotherStrong123!',
                },
                format='json',
            )

        self.assertEqual(reset_response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('AnotherStrong123!'))
        self.assertIsNone(self.user.reset_token)
        self.assertEqual(
            self.client.post(
                reverse('reset-password', kwargs={'token': signed_token}),
                {
                    'password': 'AThirdStrong123!',
                    'password2': 'AThirdStrong123!',
                },
                format='json',
            ).status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_failed_password_reset_delivery_clears_reset_token(self):
        with patch(
            'authentication.views.send_password_reset_email',
            side_effect=OSError('email service unavailable'),
        ):
            response = self.client.post(
                reverse('forgot-password'),
                {'email': self.user.email},
                format='json',
            )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.user.refresh_from_db()
        self.assertIsNone(self.user.reset_token)

    def test_expired_or_invalid_reset_token_is_rejected(self):
        response = self.client.post(
            reverse('reset-password', kwargs={'token': 'invalid-token'}),
            {
                'password': 'AnotherStrong123!',
                'password2': 'AnotherStrong123!',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', response.data['error'].lower())

    def test_password_change_checks_policy_and_updates_password(self):
        self.client.force_authenticate(self.user)
        weak_response = self.client.post(
            reverse('change-password'),
            {
                'old_password': 'StrongPass123!',
                'new_password': 'short',
                'confirm_password': 'short',
            },
            format='json',
        )
        self.assertEqual(weak_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', weak_response.data)

        response = self.client.post(
            reverse('change-password'),
            {
                'old_password': 'StrongPass123!',
                'new_password': 'AnotherStrong123!',
                'confirm_password': 'AnotherStrong123!',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('AnotherStrong123!'))


class ResendBackendTests(APITestCase):
    @override_settings(
        RESEND_API_KEY='test-api-key',
        DEFAULT_FROM_EMAIL='Innovest <no-reply@example.com>',
    )
    @patch('authentication.email_backend.requests.post')
    def test_resend_backend_sends_email_using_https_api(self, post):
        post.return_value.raise_for_status.return_value = None
        message = EmailMessage(
            'Verify your email',
            'Open the verification link.',
            to=['new-user@example.com'],
        )

        from authentication.email_backend import ResendEmailBackend

        sent_count = ResendEmailBackend().send_messages([message])

        self.assertEqual(sent_count, 1)
        self.assertEqual(post.call_args.args[0], 'https://api.resend.com/emails')
        self.assertEqual(
            post.call_args.kwargs['headers']['Authorization'],
            'Bearer test-api-key',
        )
        self.assertEqual(post.call_args.kwargs['json']['to'], ['new-user@example.com'])

    @override_settings(RESEND_API_KEY='', DEFAULT_FROM_EMAIL='sender@example.com')
    def test_resend_backend_fails_clearly_without_api_key(self):
        from authentication.email_backend import ResendEmailBackend

        with self.assertRaises(ImproperlyConfigured):
            ResendEmailBackend().send_messages([
                EmailMessage('Subject', 'Body', to=['user@example.com'])
            ])


class PublicImageServingTests(APITestCase):
    def test_image_route_rejects_traversal_into_private_directories(self):
        request = RequestFactory().get('/media/profile_pics/../company_documents/private.png')

        with self.assertRaises(Http404):
            public_uploaded_image(
                request,
                'profile_pics/../company_documents/private.png',
            )

    def test_uploaded_profile_image_is_available_on_production_media_route(self):
        user = get_user_model().objects.create_user(
            email='image-owner@example.com',
            password='StrongPass123!',
            first_name='Image',
            last_name='Owner',
        )
        self.client.force_authenticate(user)
        image_bytes = BytesIO()
        Image.new('RGB', (4, 3), color='blue').save(image_bytes, format='PNG')
        image = SimpleUploadedFile(
            'profile.png',
            image_bytes.getvalue(),
            content_type='image/png',
        )

        with TemporaryDirectory() as media_root, override_settings(
            MEDIA_ROOT=media_root,
            DEBUG=False,
        ):
            upload_response = self.client.patch(
                reverse('user-profile-update'),
                {'profile_pic': image},
                format='multipart',
            )
            self.assertEqual(upload_response.status_code, status.HTTP_200_OK)
            image_path = upload_response.data['profile_pic'].split('/media/', 1)[1]

            self.client.force_authenticate(user=None)
            image_response = self.client.get(f'/media/{image_path}')
            private_response = self.client.get(
                f'/media/company_documents/{image_path.split("/")[-1]}'
            )
            image_response.close()
            private_response.close()

        self.assertEqual(image_response.status_code, status.HTTP_200_OK)
        self.assertEqual(image_response['Content-Type'], 'image/png')
        self.assertEqual(private_response.status_code, status.HTTP_404_NOT_FOUND)
