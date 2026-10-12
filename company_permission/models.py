from django.db import models
from django.contrib.auth import get_user_model
from companies.models import Company

User = get_user_model()


class CompanyPermission(models.Model):
    PPT_CHOICES = (('accept', 'Accept'), ('discard', 'Discard'))
    REQUEST_ACCESS_CHOICES = (('yes', 'Yes'), ('no', 'No'))
    COMPANY_PERMISSION_CHOICES = (
        ('pending', 'Pending'), ('yes', 'Yes'), ('no', 'No'))

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, db_column='user_id')
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, db_column='company_id')
    ppt = models.CharField(
        max_length=10, choices=PPT_CHOICES, default='accept')
    request_access = models.CharField(
        max_length=5, choices=REQUEST_ACCESS_CHOICES, default='yes')
    company_permission = models.CharField(
        max_length=10, choices=COMPANY_PERMISSION_CHOICES, default='pending', db_column='company_permission')
    user_intro = models.TextField(blank=True, null=True)
    user_purpose = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company_permission'
        managed = True
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.company} - {self.created_at}"


class CompanyNotification(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.SET_NULL, related_name='notifications',
        null=True, blank=True)
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='company_notifications')
    message = models.CharField(max_length=500)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
