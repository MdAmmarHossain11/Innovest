from rest_framework import serializers
from .models import Company
from backend.models import CompanyFundraiseTerms, CompanyPayment
import logging
from decimal import Decimal
from authentication.models import CustomUser

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
    profile_picture = serializers.SerializerMethodField()
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country', 'profile_picture', 'profile_pic']

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            return obj.profile_pic.url
        return None

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
    cover_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Company
        fields = ['id', 'user_id', 'product_name', 'quick_description', 'industry', 'city', 
                 'state', 'country', 'cover_image', 'slide_image', 'company_status', 
                 'created_at', 'fundraise_terms', 'total_payments']
    
    def get_cover_image(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

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