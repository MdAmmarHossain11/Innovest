from django.urls import path
from .views import CustomUserKYCListView, CustomUserKYCRetrieveDestroyView

urlpatterns = [
    path('kyc/', CustomUserKYCListView.as_view(), name='kyc-list'),
    path('kyc/<int:id>/', CustomUserKYCRetrieveDestroyView.as_view(), name='kyc-detail'),
] 