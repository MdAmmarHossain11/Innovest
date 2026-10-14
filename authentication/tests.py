from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
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
