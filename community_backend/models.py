from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class CommunityPost(models.Model):
    POST_TYPES = [
        ('Discussion', 'Discussion'),
        ('Project Update', 'Project Update'),
        ('Question', 'Question'),
        ('Idea', 'Idea'),
        ('Other', 'Other'),
        ('Event', 'Event'),
    ]
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts', null=True, blank=True)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=32, choices=POST_TYPES)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    tags = models.CharField(max_length=300, blank=True, help_text='Comma-separated tags')
    description = models.TextField()
    attachment = models.FileField(upload_to='community_attachments/', blank=True, null=True)
    # Event-specific fields
    eventLocation = models.CharField(max_length=200, blank=True)
    eventLocationLink = models.URLField(blank=True)
    eventStartDateTime = models.DateTimeField(blank=True, null=True)
    eventEndDateTime = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class CommunityPostNotification(models.Model):
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='community_post_notifications')
    post = models.ForeignKey(
        CommunityPost, on_delete=models.CASCADE, related_name='notifications')
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.CharField(
        max_length=3, choices=[('No', 'No'), ('Yes', 'Yes')], default='No')

    @property
    def user(self):
        return self.post.user


class CommunityComment(models.Model):
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='replies',
        null=True,
        blank=True,
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    read = models.CharField(max_length=3, choices=[('No', 'No'), ('Yes', 'Yes')], default='No')

    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.title}'

class CommunityInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_interests')
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name='interests')
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.CharField(max_length=3, choices=[('No', 'No'), ('Yes', 'Yes')], default='No')

    class Meta:
        unique_together = ('user', 'post')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} interested in {self.post.title}"
