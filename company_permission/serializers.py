from rest_framework import serializers
from .models import CompanyPermission, CompanyNotification


class CompanyPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPermission
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'company_permission')

    def validate(self, data):
        # Validate required fields
        if not data.get('company'):
            raise serializers.ValidationError("Company ID is required")

        if not data.get('user_intro'):
            raise serializers.ValidationError(
                "Please provide a brief introduction")

        if not data.get('user_purpose'):
            raise serializers.ValidationError(
                "Please explain why you are interested in this company")

        return data


class CompanyNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyNotification
        fields = ('id', 'company', 'message', 'read', 'created_at')
