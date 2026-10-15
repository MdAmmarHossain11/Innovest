from rest_framework import serializers
from .models import CommunityPost, CommunityComment


class CommunityPostSerializer(serializers.ModelSerializer):
    interest_count = serializers.SerializerMethodField()
    is_interested = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    # Community attachments are images only.  ImageField also verifies that
    # uploaded bytes are an actual image instead of trusting the file suffix.
    attachment = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CommunityPost
        fields = '__all__'

    def get_interest_count(self, obj):
        return obj.interests.count()

    def get_is_interested(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.interests.filter(user=user).exists()
        return False

    def get_user(self, obj):
        if obj.user:
            request = self.context.get('request')
            profile_picture_url = None
            # Check both profile_pic and profile_picture fields
            profile_image = getattr(obj.user, 'profile_pic', None) or getattr(
                obj.user, 'profile_picture', None)
            if profile_image:
                if request:
                    profile_picture_url = request.build_absolute_uri(
                        profile_image.url)
                else:
                    profile_picture_url = profile_image.url

            return {
                'id': obj.user.id,
                'username': obj.user.email,
                'first_name': obj.user.first_name,
                'last_name': obj.user.last_name,
                'profile_picture': profile_picture_url
            }
        return None


class CommunityCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    post = serializers.PrimaryKeyRelatedField(
        queryset=CommunityPost.objects.all())
    parent_id = serializers.PrimaryKeyRelatedField(
        source='parent', queryset=CommunityComment.objects.all(),
        required=False, allow_null=True
    )

    class Meta:
        model = CommunityComment
        fields = ['id', 'post', 'user', 'content',
                  'created_at', 'updated_at', 'parent_id']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_user(self, obj):
        profile_picture_url = None
        # Check both profile_pic and profile_picture fields
        profile_image = getattr(obj.user, 'profile_pic', None) or getattr(
            obj.user, 'profile_picture', None)
        if profile_image:
            request = self.context.get('request')
            if request:
                profile_picture_url = request.build_absolute_uri(
                    profile_image.url)
            else:
                profile_picture_url = profile_image.url

        return {
            'id': obj.user.id,
            'username': obj.user.email,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'profile_picture': profile_picture_url
        }

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError(
                "Comment content cannot be empty")
        if len(value.strip()) > 1000:  # Maximum length of 1000 characters
            raise serializers.ValidationError(
                "Comment content cannot exceed 1000 characters")
        return value.strip()

    def validate(self, attrs):
        parent = attrs.get('parent')
        post = attrs.get('post') or getattr(self.instance, 'post', None)
        if parent and parent.post_id != post.id:
            raise serializers.ValidationError({
                'parent_id': 'A reply must belong to a comment on the same post.'
            })
        return attrs


class NotificationSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField()  # 'comment', 'interest', or 'post'
    user = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField()
    read = serializers.CharField()
    message = serializers.CharField()

    def get_user(self, obj):
        # obj.user for both comment and interest
        u = obj.user
        return {
            'id': u.id,
            'first_name': u.first_name,
            'last_name': u.last_name,
        }

    def get_post(self, obj):
        # obj.post for both comment and interest
        p = obj.post
        return {
            'id': p.id,
            'title': p.title,
        }
