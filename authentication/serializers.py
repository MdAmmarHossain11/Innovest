from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from Innovest.fields import PublicMediaImageField

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    profile_pic = PublicMediaImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            'email', 'password', 'password2', 'first_name', 'last_name',
            'title', 'company', 'website', 'city', 'state', 'bio', 'profile_pic'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                'password2': "Passwords don't match"
            })
        try:
            validate_password(data['password'])
        except ValidationError as error:
            raise serializers.ValidationError({
                'password': error.messages
            }) from error
        return data

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                'An account with this email address already exists.'
            )
        return email

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    profile_pic = PublicMediaImageField(required=False, allow_null=True)
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    email_verified = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name',
            'title', 'company', 'website', 'address', 'city', 'state', 'country', 'bio', 'profile_pic',
            'user_type', 'is_staff', 'is_superuser', 'is_active', 'email_verified',
            'phone', 'dob'
        )
        read_only_fields = (
            'user_type', 'is_staff', 'is_superuser', 'is_active', 'email_verified'
        )
        extra_kwargs = {
            'email': {'required': True},
        }

    def update(self, instance, validated_data):
        profile_pic = validated_data.pop('profile_pic', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if profile_pic:
            instance.profile_pic = profile_pic
        instance.save()
        return instance