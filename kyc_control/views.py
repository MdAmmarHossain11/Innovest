from django.shortcuts import render
from rest_framework import generics
from .models import CustomUserKYC
from .serializers import CustomUserKYCSerializer

# Create your views here.

class CustomUserKYCListView(generics.ListAPIView):
    queryset = CustomUserKYC.objects.all().order_by('-submitted_at')
    serializer_class = CustomUserKYCSerializer

class CustomUserKYCRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = CustomUserKYC.objects.all()
    serializer_class = CustomUserKYCSerializer
    lookup_field = 'id'
