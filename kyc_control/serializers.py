from rest_framework import serializers
from .models import CustomUserKYC
from companies.models import Company

class CustomUserKYCSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUserKYC
        fields = [
            'id', 'company_id', 'company_name', 'user_id', 'name', 'email', 'phone_number', 'date_of_birth',
            'address', 'city', 'country', 'id_type', 'id_document_path', 'address_proof_type',
            'address_proof_path', 'business_name', 'business_registration_number', 'entity_type',
            'source_of_funds', 'declaration', 'signature_path', 'submitted_at'
        ]

    def get_company_name(self, obj):
        try:
            company = Company.objects.get(id=obj.company_id)
            return company.product_name
        except Company.DoesNotExist:
            return None 