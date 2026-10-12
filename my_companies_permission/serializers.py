from rest_framework import serializers
from .models import CompanyPermission
from authentication.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'user_type', 'title', 'company', 'website',
            'city', 'state', 'bio', 'profile_pic', 'phone', 'position', 'address', 'profile_picture'
        ]

class CompanyPermissionSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    address = serializers.SerializerMethodField()

    class Meta:
        model = CompanyPermission
        fields = [
            'id', 'company', 'user', 'ppt', 'request_access', 'company_permission',
            'user_intro', 'user_purpose', 'created_at', 'updated_at', 'address'
        ]

    def get_address(self, obj):
        user = obj.user
        country = getattr(user, 'country', '') or ''
        parts = [user.city, user.address, country]
        return ', '.join([p for p in parts if p])

# --- Added for permit user detail modal ---
class PermitUserDetailSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    company = serializers.CharField(source='user.company', default='')
    joining_date = serializers.SerializerMethodField()
    about = serializers.CharField(source='user.bio', default='')
    designation = serializers.CharField(source='user.title', default='')
    website = serializers.CharField(source='user.website', default='')
    email = serializers.CharField(source='user.email', default='')
    mobile = serializers.CharField(source='user.phone', default='')
    title = serializers.CharField(source='user.title', default='')
    first_name = serializers.CharField(source='user.first_name', default='')
    last_name = serializers.CharField(source='user.last_name', default='')

    class Meta:
        model = CompanyPermission
        fields = [
            'profile_pic', 'full_name', 'first_name', 'last_name', 'title', 'company',
            'location', 'address', 'country', 'joining_date', 'about', 'designation', 'website', 'email', 'mobile',
            'user_intro', 'user_purpose'
        ]

    def get_profile_pic(self, obj):
        user = obj.user
        if user.profile_pic:
            return user.profile_pic.url
        return None

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_country(self, obj):
        user = obj.user
        return getattr(user, 'country', '') or ''

    def get_location(self, obj):
        user = obj.user
        country = self.get_country(obj)
        parts = [user.city, user.address, country]
        return ', '.join([p for p in parts if p or p == ''])

    def get_address(self, obj):
        user = obj.user
        country = self.get_country(obj)
        parts = [user.city, user.address, country]
        return ', '.join([p for p in parts if p or p == ''])

    def get_joining_date(self, obj):
        user = obj.user
        if user.created_at:
            return user.created_at.date().isoformat()
        return '' 