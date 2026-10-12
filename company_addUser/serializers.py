from rest_framework import serializers
from .models import CompanyPayment, ChatChatRequest

class CompanyPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPayment
        fields = '__all__'

class ChatChatRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatChatRequest
        fields = '__all__' 