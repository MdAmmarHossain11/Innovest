from django.contrib import admin
from .models import CompanyBusinessPlan, CompanyFundraiseTerms, CompanyContact

@admin.register(CompanyBusinessPlan)
class CompanyBusinessPlanAdmin(admin.ModelAdmin):
    list_display = ('company', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('company__name', 'executive_summary', 'problem_description', 'solution_description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CompanyFundraiseTerms)
class CompanyFundraiseTermsAdmin(admin.ModelAdmin):
    list_display = ('company', 'investment_type', 'raise_amount', 'created_at')
    list_filter = ('investment_type', 'created_at', 'updated_at')
    search_fields = ('company__name', 'investment_type', 'additional_terms')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(CompanyContact)
class CompanyContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',) 