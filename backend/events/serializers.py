from rest_framework import serializers
from .models import CompanyEvent

class CompanyEventSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    user = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = CompanyEvent
        fields = ['id', 'company', 'company_name', 'title', 'description', 
                 'date', 'location', 'image', 'created_at', 'user'] 