from rest_framework import serializers
from .models import Company
from backend.models import CompanyFundraiseTerms, CompanyPayment
import logging
from decimal import Decimal
from authentication.models import CustomUser
from Innovest.fields import PublicMediaImageField
from Innovest.media import public_media_url

logger = logging.getLogger(__name__)

class CompanyFundraiseTermsSerializer(serializers.ModelSerializer):
    raise_amount = serializers.FloatField()
    pre_money_valuation = serializers.FloatField()
    max_investors = serializers.IntegerField()
    duration = serializers.CharField()
    investment_type = serializers.CharField()

    class Meta:
        model = CompanyFundraiseTerms
        fields = ['raise_amount', 'pre_money_valuation', 'max_investors', 'duration', 'investment_type']

class UserSerializer(serializers.ModelSerializer):
    profile_picture = PublicMediaImageField(read_only=True)
    profile_pic = PublicMediaImageField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country', 'profile_picture', 'profile_pic']

class CompanyPaymentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CompanyPayment
        fields = [
            'payment_id',
            'user',
            'company',
            'amount',
            'payment_method',
            'transaction_id',
            'payment_status',
            'payment_date'
        ]
        read_only_fields = ['payment_id', 'payment_date']

    def create(self, validated_data):
        # Set payment status to 'unpaid' when creating a new payment
        validated_data['payment_status'] = 'unpaid'
        return super().create(validated_data)

class CompanySerializer(serializers.ModelSerializer):
    fundraise_terms = serializers.SerializerMethodField()
    total_payments = serializers.SerializerMethodField()
    cover_image = PublicMediaImageField(read_only=True)
    
    class Meta:
        model = Company
        fields = ['id', 'user_id', 'product_name', 'quick_description', 'industry', 'city', 
                 'state', 'country', 'cover_image', 'slide_image', 'company_status', 
                 'created_at', 'fundraise_terms', 'total_payments']
    
    def get_fundraise_terms(self, obj):
        fundraise_terms = obj.get_fundraise_terms()
        logger.debug(f"Getting fundraise terms for company {obj.id} - {obj.product_name}")
        if fundraise_terms:
            logger.debug(f"Found fundraise terms - Raise Amount: {fundraise_terms.raise_amount}, "
                        f"Valuation: {fundraise_terms.pre_money_valuation}, "
                        f"Max Investors: {fundraise_terms.max_investors}, "
                        f"Duration: {fundraise_terms.duration}")
            return CompanyFundraiseTermsSerializer(fundraise_terms).data
        logger.debug("No fundraise terms found")
        return None

    def get_total_payments(self, obj):
        total = obj.get_total_payments()
        logger.debug(f"Total payments for company {obj.id}: {total}")
        return float(total) if total else 0 
