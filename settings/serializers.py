from rest_framework import serializers
from authentication.models import CustomUser
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

class UserProfileSerializer(serializers.ModelSerializer):
    website = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    dob = serializers.DateField(required=False, allow_null=True)

    def validate_website(self, value):
        if not value:  # If empty or None, return as is
            return value
        try:
            URLValidator()(value)
            return value
        except ValidationError:
            raise serializers.ValidationError("Enter a valid URL.")

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone',
            'title', 'company', 'website', 'city', 'state',
            'bio', 'profile_pic', 'position', 'address',
            'created_at', 'country', 'dob'
        ]
        read_only_fields = ['id', 'email', 'created_at']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': False, 'allow_null': True},
            'title': {'required': False, 'allow_null': True, 'allow_blank': True},
            'company': {'required': False, 'allow_null': True},
            'city': {'required': False, 'allow_null': True},
            'state': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_null': True},
            'profile_pic': {'required': False, 'allow_null': True},
            'position': {'required': False, 'allow_null': True},
            'address': {'required': False, 'allow_null': True},
            'country': {'required': False, 'allow_null': True},
            'dob': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        # Log the incoming data
        print("Validating data:", data)
        return data 