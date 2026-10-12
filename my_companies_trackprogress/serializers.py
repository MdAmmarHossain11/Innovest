from rest_framework import serializers
from .models import CompanyTrackProgress, CompanyUpdate

class CompanyTrackProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyTrackProgress
        fields = '__all__'

class CompanyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyUpdate
        fields = '__all__' 