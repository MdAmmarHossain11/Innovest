from django.conf import settings
from django.db import models
from companies.models import Company

# We'll use the existing Company model from companies app
CompanyControl = Company 


class AdminNotification(models.Model):
    """A broadcast or administrator-specific work item for the admin console."""

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='admin_notifications',
        null=True,
        blank=True,
    )
    category = models.CharField(max_length=30)
    message = models.CharField(max_length=500)
    target_url = models.CharField(max_length=255, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
