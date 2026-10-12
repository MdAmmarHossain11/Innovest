from rest_framework import serializers
from .models import CompanyBusinessPlan, CompanyFundraiseTerms, CompanyContact, CustomUserKYC
 
class CompanyBusinessPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyBusinessPlan
        fields = '__all__'

class CompanyFundraiseTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyFundraiseTerms
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        investment_type = instance.investment_type

        # Common fields for all investment types
        common_fields = {
            'raise_amount',
            'duration',
            'funding_committed_offline',
            'additional_terms',
            'investment_type',
            'min_investment_amount',
        }

        # Fields specific to each investment type
        equity_fields = {
            'pre_money_valuation',
            'previous_investments',
            'max_investors',
            'min_investment_amount'
        }

        convertible_debt_fields = {
            'pre_money_valuation',
            'previous_investments',
            'valuation_cap_amount',
            'convertible_note_discount',
            'max_investors',
            'min_investment_amount'
        }

        debt_fields = {
            'annual_interest_rate',
            'repayment_term'
        }

        # Determine which fields to include based on investment type
        if investment_type == 'equity':
            allowed_fields = common_fields.union(equity_fields)
        elif investment_type == 'convertible debt':
            allowed_fields = common_fields.union(convertible_debt_fields)
        elif investment_type == 'debt':
            allowed_fields = common_fields.union(debt_fields)
        else:
            allowed_fields = common_fields

        # Filter out fields that aren't in the allowed set
        return {k: v for k, v in data.items() if k in allowed_fields}

class CompanyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyContact
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'name': {'required': True},
            'email': {'required': True},
            'message': {'required': True},
            'phone': {'required': False},
            'subject': {'required': False}
        }

class CustomUserKYCSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserKYC
        fields = [
            'id', 'company', 'user', 'name', 'email', 'phone_number',
            'date_of_birth', 'address', 'city', 'country', 'id_type',
            'id_document_path', 'address_proof_type', 'address_proof_path',
            'business_name', 'business_registration_number', 'entity_type',
            'source_of_funds', 'declaration', 'signature_path', 'submitted_at'
        ]
        read_only_fields = ['id', 'submitted_at'] 