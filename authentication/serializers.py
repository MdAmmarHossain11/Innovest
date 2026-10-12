from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

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
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'last_name',
            'title', 'company', 'website', 'address', 'city', 'state', 'country', 'bio', 'profile_pic',
            'user_type', 'phone', 'dob'
        )
        extra_kwargs = {
            'email': {'required': True},
        }

    def update(self, instance, validated_data):
        print("=== UserSerializer.update called ===")
        print("validated_data:", validated_data)
        profile_pic = validated_data.pop('profile_pic', None)
        for attr, value in validated_data.items():
            print(f"Setting {attr} to {value}")
            setattr(instance, attr, value)
        if profile_pic:
            print("Updating profile_pic")
            instance.profile_pic = profile_pic
        instance.save()
        print("User saved:", instance)
        return instance 