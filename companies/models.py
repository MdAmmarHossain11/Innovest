from django.db import models
from django.db.models import Sum
from django.db import OperationalError


class Company(models.Model):
    user_id = models.IntegerField(null=True, blank=True)
    product_name = models.CharField(max_length=255)
    quick_description = models.TextField(blank=True)
    industry = models.CharField(max_length=100)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    cover_image = models.ImageField(
        upload_to='company_covers/', null=True, blank=True)
    slide_image = models.TextField(blank=True, null=True)
    company_status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected')
    ], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['-created_at']

    def __str__(self):
        return self.product_name

    def get_fundraise_terms(self):
        # Import here to avoid circular import
        from backend.models import CompanyFundraiseTerms
        try:
            return CompanyFundraiseTerms.objects.get(company_id=self.id)
        except CompanyFundraiseTerms.DoesNotExist:
            return None

    def get_total_payments(self):
        # Import here to avoid circular import
        from backend.models import CompanyPayment
        try:
            total = CompanyPayment.objects.filter(
                company_id=self.id,
                payment_status='paid'
            ).aggregate(total=Sum('amount'))['total']
        except OperationalError:
            # Older installations may not have the optional payment table yet.
            total = 0
        return total or 0
