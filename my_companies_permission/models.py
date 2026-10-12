from django.db import models
from companies.models import Company
from authentication.models import CustomUser

# Create your models here.

class CompanyPermission(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='permissions')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='company_permissions')
    ppt = models.CharField(max_length=10)
    request_access = models.CharField(max_length=5)
    company_permission = models.CharField(max_length=10, default='pending')
    user_intro = models.TextField(blank=True, null=True)
    user_purpose = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company_permission'
        unique_together = ('company', 'user')
        managed = False

    def __str__(self):
        return f"{self.user.email} - {self.company.product_name} ({self.company_permission})"
