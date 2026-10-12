from django.urls import path
from .views import CompanyPermissionViewSet, PermitUserDetailView

urlpatterns = [
    # List all permission requests for a company
    path('company/<int:company_id>/permissions/', CompanyPermissionViewSet.as_view({'get': 'list'}), name='company-permission-list'),
    # Update or delete a specific permission request
    path('company-permissions/<int:pk>/', CompanyPermissionViewSet.as_view({'patch': 'partial_update', 'delete': 'destroy'}), name='company-permission-detail'),
    # Permit user detail endpoint
    path('company-permissions/<int:pk>/user-detail/', PermitUserDetailView.as_view(), name='permit-user-detail'),
] 