from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, CompanyListView, FileUploadView

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')

urlpatterns = [
    path('', include(router.urls)),
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/total_payments/', CompanyViewSet.as_view({'get': 'total_payments'}), name='company-total-payments'),
    path('companies/<int:pk>/user_payments/', CompanyViewSet.as_view({'get': 'user_payments'}), name='company-user-payments'),
    path('companies/<int:pk>/paid_investors_count/', CompanyViewSet.as_view({'get': 'paid_investors_count'}), name='company-paid-investors-count'),
    # File upload endpoint
    path('upload-image/', FileUploadView.as_view(), name='upload-image'),
] 