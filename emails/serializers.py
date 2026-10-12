from rest_framework import serializers
from backend.models import CompanyContact

class CompanyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyContact
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
