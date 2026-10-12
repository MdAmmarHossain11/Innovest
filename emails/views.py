from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, pagination
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from backend.models import CompanyContact
from .serializers import CompanyContactSerializer
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CompanyContact  # Correct model import

logger = logging.getLogger(__name__)

# Create your views here.

class CompanyContactPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CompanyContactViewSet(viewsets.ModelViewSet):
    queryset = CompanyContact.objects.all()
    serializer_class = CompanyContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CompanyContactPagination
    authentication_classes = [JWTAuthentication]
    
    def list(self, request, *args, **kwargs):
        # Log authentication details
        logger.info(f"User: {request.user}")
        logger.info(f"Authentication: {request.auth}")
        logger.info(f"Request headers: {request.headers}")
        logger.info(f"Query params: {request.query_params}")
        
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        # Optional: Add filtering or search capabilities
        queryset = CompanyContact.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                name__icontains=search) | queryset.filter(
                email__icontains=search) | queryset.filter(
                subject__icontains=search)
        return queryset

class BulkDeleteContactView(APIView):
    def post(self, request):
        ids = request.data.get('ids', [])
        if not ids:
            return Response({'error': 'No IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        deleted, _ = CompanyContact.objects.filter(id__in=ids).delete()  # Use correct model
        return Response({'deleted': deleted}, status=status.HTTP_200_OK)
