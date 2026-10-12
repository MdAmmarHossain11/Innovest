from rest_framework import serializers
from companies.models import Company

class CompanyControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'  # This will include all fields from the model
        read_only_fields = ['created_at', 'updated_at'] 