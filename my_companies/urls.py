from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, FundraiseTermsViewSet, BusinessPlanViewSet

router = DefaultRouter()
router.register('my-companies', CompanyViewSet, basename='my-company')
router.register('fundraise-terms', FundraiseTermsViewSet, basename='fundraise-terms')
router.register('business-plans', BusinessPlanViewSet, basename='business-plans')

urlpatterns = [
    path('', include(router.urls)),
] 