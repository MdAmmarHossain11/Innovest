from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyControlViewSet, admin_notifications

router = DefaultRouter()
router.register(r'companies', CompanyControlViewSet, basename='company-control')

urlpatterns = [
    path('notifications/', admin_notifications, name='admin-notifications'),
    path('', include(router.urls)),
] 
