from django.shortcuts import render
from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import CompanyPermission
from company_permission.models import CompanyNotification
from .serializers import CompanyPermissionSerializer, PermitUserDetailSerializer
from companies.models import Company
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

# Create your views here.


class CompanyPermissionViewSet(viewsets.ViewSet):
    def list(self, request, company_id=None):
        """List all permission requests for a company, with user info"""
        company = get_object_or_404(Company, id=company_id)
        permissions = CompanyPermission.objects.filter(company=company)
        serializer = CompanyPermissionSerializer(permissions, many=True)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        """Update the status (company_permission) of a request"""
        permission = get_object_or_404(CompanyPermission, id=pk)
        company_permission = request.data.get('company_permission')
        if company_permission is not None:
            previous_permission = permission.company_permission
            permission.company_permission = company_permission
            permission.save()
            if previous_permission != company_permission:
                CompanyNotification.objects.create(
                    company=permission.company,
                    recipient=permission.user,
                    message=(
                        f"Your request to view {permission.company.product_name}'s business plan "
                        f"was {'approved' if company_permission == 'yes' else 'rejected' if company_permission == 'no' else 'updated'}."
                    )
                )
            return Response({'status': 'updated'})
        return Response({'error': 'company_permission required'}, status=400)

    def destroy(self, request, pk=None):
        """Delete a permission request"""
        permission = get_object_or_404(CompanyPermission, id=pk)
        permission.delete()
        return Response({'status': 'deleted'})

# --- Added for permit user detail modal ---


class PermitUserDetailView(APIView):
    def get(self, request, pk):
        try:
            permission = CompanyPermission.objects.select_related(
                'user').get(pk=pk)
        except CompanyPermission.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PermitUserDetailSerializer(permission)
        return Response(serializer.data)
