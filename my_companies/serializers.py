from rest_framework import serializers
from .models import Company, FundraiseTerms, BusinessPlan

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'user_id', 'product_name', 'quick_description', 'industry', 'city', 
                 'state', 'country', 'cover_image', 'slide_image', 'company_status', 'created_at', 'updated_at']

class FundraiseTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundraiseTerms
        fields = '__all__'

class BusinessPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessPlan
        fields = '__all__' 