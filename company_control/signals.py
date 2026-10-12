from django.db.utils import OperationalError, ProgrammingError
from django.db.models.signals import post_save
from django.dispatch import receiver

from authentication.models import CustomUser
from backend.models import CustomUserKYC
from companies.models import Company
from .models import AdminNotification


def create_admin_notification(category, message, target_url):
    """Do not let a notification outage break a business workflow."""
    try:
        AdminNotification.objects.create(
            category=category, message=message, target_url=target_url
        )
    except (OperationalError, ProgrammingError):
        # Allows initial migrations to run before the notification table exists.
        pass


@receiver(post_save, sender=CustomUser)
def notify_admins_of_new_user(sender, instance, created, **kwargs):
    if created and instance.user_type != 'admin':
        create_admin_notification(
            'user',
            f'New user registered: {instance.get_full_name() or instance.email}.',
            '/admin-dashboard?tab=users',
        )


@receiver(post_save, sender=Company)
def notify_admins_of_new_company(sender, instance, created, **kwargs):
    if created:
        create_admin_notification(
            'company',
            f'New company submitted: {instance.product_name}.',
            '/admin-dashboard?tab=companies',
        )


@receiver(post_save, sender=CustomUserKYC)
def notify_admins_of_new_kyc(sender, instance, created, **kwargs):
    if created:
        create_admin_notification(
            'kyc',
            f'New KYC submission received from {instance.email}.',
            '/admin-dashboard?tab=kyc',
        )
