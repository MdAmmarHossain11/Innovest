from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import CommunityPostNotification


class CommunityPostNotificationsTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.author = user_model.objects.create_user(
            email='author@example.com',
            password='test-password',
            first_name='Post',
            last_name='Author',
        )
        self.recipient = user_model.objects.create_user(
            email='recipient@example.com',
            password='test-password',
            first_name='Post',
            last_name='Reader',
        )
        self.author_client = APIClient()
        self.author_client.force_authenticate(self.author)

    def test_public_post_notifies_other_users_and_can_be_marked_read(self):
        response = self.author_client.post(
            '/api/community/posts/',
            {
                'title': 'A public community post',
                'type': 'Discussion',
                'visibility': 'public',
                'description': 'Post body',
                'tags': '',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        post_id = response.data['id']
        notification = CommunityPostNotification.objects.get(
            recipient=self.recipient,
            post_id=post_id,
        )
        self.assertEqual(notification.read, 'No')
        self.assertFalse(
            CommunityPostNotification.objects.filter(
                recipient=self.author,
                post_id=post_id,
            ).exists()
        )

        recipient_client = APIClient()
        recipient_client.force_authenticate(self.recipient)
        notifications_response = recipient_client.get('/api/community/notifications/')
        post_notification = next(
            item for item in notifications_response.data['results']
            if item['type'] == 'post'
        )
        self.assertEqual(post_notification['post']['title'], 'A public community post')
        self.assertEqual(notifications_response.data['unread_count'], 1)

        read_response = recipient_client.get(
            '/api/community/notifications/',
            {'mark_read': 'true'},
        )
        self.assertEqual(read_response.data['unread_count'], 0)
        notification.refresh_from_db()
        self.assertEqual(notification.read, 'Yes')

    def test_private_post_does_not_notify_other_users(self):
        response = self.author_client.post(
            '/api/community/posts/',
            {
                'title': 'A private community post',
                'type': 'Discussion',
                'visibility': 'private',
                'description': 'Private post body',
                'tags': '',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertFalse(
            CommunityPostNotification.objects.filter(
                recipient=self.recipient,
                post_id=response.data['id'],
            ).exists()
        )
