from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    user_type = serializers.CharField(required=True)
    is_staff = serializers.BooleanField(default=False)
    email_verified = serializers.BooleanField(default=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    #address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    #city = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    country = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'user_type', 
                 'is_staff', 'title', 'company', 'website', 'city', 'state', 'bio',
                 'phone', 'position', 'address', 'country', 'is_active', 'email_verified',
                 'verification_token', 'profile_picture', 'profile_pic')
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'read_only': True},
            'verification_token': {'read_only': True}
        }

    def create(self, validated_data):
        try:
            # Create user with required fields
            user = User.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                user_type=validated_data['user_type'],
                is_staff=validated_data.get('is_staff', False),
                email_verified=True  # Explicitly set email_verified to True
            )

            # Set optional fields
            user.title = validated_data.get('title', 'Mr.')
            user.company = validated_data.get('company', '')
            user.website = validated_data.get('website', '')
            user.city = validated_data.get('city', 'City')
            user.state = validated_data.get('state', 'State')
            user.country = validated_data.get('country', 'Country')
            user.bio = validated_data.get('bio', 'Welcome to Innovest!')
            user.phone = validated_data.get('phone', '')
            user.position = validated_data.get('position', '')
            user.address = validated_data.get('address', '')
            user.is_active = True

            user.save()
            return user
        except Exception as e:
            raise serializers.ValidationError(f"Error creating user: {str(e)}")

    def validate_email(self, value):
        # Skip email validation for updates
        if self.instance and self.instance.email == value:
            return value
            
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def update(self, instance, validated_data):
        # Handle password update separately
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure all fields are included in the response
        for field in self.Meta.fields:
            if field not in data:
                data[field] = getattr(instance, field, None)
        print("Serialized user data:", data)  # Debug print
        return data 