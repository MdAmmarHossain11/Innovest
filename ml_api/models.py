from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class CompanyAnalysis(models.Model):
    """Model to store company analysis data for ML training and prediction"""
    #user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='company_analyses')
    startup_name = models.CharField(max_length=255, blank=True, null=True)
    industry = models.CharField(max_length=100)
    funding_rounds = models.CharField(max_length=100, blank=True, null=True)
    funding_amount_m_usd = models.CharField(max_length=100, blank=True, null=True)
    valuation_m_usd = models.CharField(max_length=100, blank=True, null=True)
    revenue_m_usd = models.CharField(max_length=100, blank=True, null=True)
    employees = models.CharField(max_length=100, blank=True, null=True)
    market_share_percent = models.CharField(max_length=100, blank=True, null=True)
    profitable = models.CharField(max_length=10, blank=True, null=True)  # 1 or 0
    year_founded = models.CharField(max_length=10, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    exit_status = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    prediction = models.JSONField(blank=True, null=True)  # Store prediction results

    def __str__(self):
        return f"{self.startup_name or 'Unknown'} - {self.industry}"

    class Meta:
        verbose_name_plural = "Company Analyses"
        ordering = ['-created_at']
