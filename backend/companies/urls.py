from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, CompanyListView, CompanyPaymentViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'payments', CompanyPaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/total_payments/', CompanyViewSet.as_view({'get': 'total_payments'}), name='company-total-payments'),
    path('companies/<int:pk>/user_payments/', CompanyViewSet.as_view({'get': 'user_payments'}), name='company-user-payments'),
    path('payments/verify_payment/', CompanyPaymentViewSet.as_view({'post': 'verify_payment'}), name='verify-payment'),
] 