from rest_framework import serializers

from .media import public_media_url


class PublicMediaImageField(serializers.ImageField):
    def to_representation(self, value):
        return public_media_url(value, self.context.get('request'))
