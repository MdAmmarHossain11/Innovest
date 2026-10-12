from django.db import models
from authentication.models import CustomUser

class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    industry = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    privacy_status = models.CharField(max_length=50, choices=[
        ('public', 'Public'),
        ('private', 'Private'),
    ], default='private')
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='company_covers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['-created_at']

    def __str__(self):
        return self.name 

class CompanyPayment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
    ]

    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments')
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    payment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_payment'
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment {self.payment_id} - {self.user.email} - {self.amount}" 