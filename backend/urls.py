from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import (
    CompanyBusinessPlanViewSet,
    CompanyFundraiseTermsViewSet,
    CompanyContactView,
    submit_kyc
)

router = routers.DefaultRouter()
router.register(r'business-plans', CompanyBusinessPlanViewSet, basename='business-plans')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authentication.urls')),
    path('api/', include('payments.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/settings/', include('settings.urls')),
    path('api/kyc/submit/', submit_kyc, name='submit_kyc'),
] + router.urls 