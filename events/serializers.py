from rest_framework import serializers
from .models import CompanyEvent
from authentication.models import CustomUser
from Innovest.fields import PublicMediaImageField
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

    def get_username(self, obj):
        return getattr(obj, 'username', None) or obj.email


class CompanyEventSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    start_at = serializers.DateTimeField(required=False, allow_null=True)
    end_at = serializers.DateTimeField(required=False, allow_null=True)
    registration_end = serializers.DateTimeField(
        required=False, allow_null=True)
    cover_image = PublicMediaImageField(required=False, allow_null=True)

    class Meta:
        model = CompanyEvent
        fields = ['id', 'user', 'title', 'description', 'cover_image',
                  'location', 'location_link', 'categories', 'registration_form', 'privacy',
                  'start_at', 'end_at', 'registration_end', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_cover_image(self, value):
        if value:
            # Check file size (5MB limit)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "Image size must be no more than 5MB")

            # Check file type
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError("File must be an image")

            # Check file extension
            allowed_extensions = ['jpg', 'jpeg', 'png', 'gif']
            ext = value.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"File must be one of: {', '.join(allowed_extensions)}")

        return value

    def validate(self, data):
        instance = self.instance
        start_at = data.get(
            'start_at', instance.start_at if instance else None)
        end_at = data.get('end_at', instance.end_at if instance else None)
        registration_end = data.get(
            'registration_end', instance.registration_end if instance else None)

        # Validate required fields when creating a new event.
        if not instance and not data.get('title'):
            raise serializers.ValidationError("Title is required")

        if not instance and not start_at:
            raise serializers.ValidationError("Start date is required")

        if not instance and not end_at:
            raise serializers.ValidationError("End date is required")

        # Validate dates
        if start_at and end_at:
            if start_at >= end_at:
                raise serializers.ValidationError(
                    "End date must be after start date")

        if registration_end and start_at:
            if registration_end > start_at:
                raise serializers.ValidationError(
                    "Registration end date must be before event start date")

        return data

    def to_representation(self, instance):
        try:
            data = super().to_representation(instance)
            # Convert datetime fields to string if they exist
            for field in ['start_at', 'end_at', 'registration_end']:
                if data.get(field):
                    try:
                        date_obj = datetime.fromisoformat(
                            data[field].replace('Z', '+00:00'))
                        data[field] = date_obj.isoformat()
                    except (ValueError, AttributeError):
                        data[field] = None
            return data
        except Exception as e:
            logger.error(f"Error serializing event {instance.id}: {str(e)}")
            return {
                'id': instance.id,
                'error': f"Error processing event data: {str(e)}"
            }
