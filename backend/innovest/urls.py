from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from backend.views import CompanyBusinessPlanViewSet, CompanyFundraiseTermsViewSet

# Create routers
router = routers.DefaultRouter()
router.register(r'business-plans', CompanyBusinessPlanViewSet, basename='business-plans')
router.register(r'fundraise-terms', CompanyFundraiseTermsViewSet, basename='fundraise-terms')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('companies.urls')),  # This includes all company and payment URLs
    path('api/', include('events.urls')),
    path('api/', include(router.urls)),
    path('api/auth/', include('authentication.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('api/company-permission/', include('company_permission.urls')),
    path('api/payments/initiate/', include('payments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 