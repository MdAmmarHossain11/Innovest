from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class AdminEventAccessTests(TestCase):
    def test_superuser_can_create_event_without_staff_or_admin_user_type(self):
        user = get_user_model().objects.create_user(
            email='event-admin@example.com',
            password='StrongPass123!',
            first_name='Event',
            last_name='Admin',
            user_type='user',
            is_superuser=True,
            is_staff=False,
        )
        client = APIClient()
        client.force_authenticate(user)

        response = client.post(
            '/api/events/',
            {
                'title': 'Admin-created event',
                'start_at': '2035-01-01T10:00:00Z',
                'end_at': '2035-01-01T11:00:00Z',
                'privacy': 'publish',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['user']['username'], user.email)
