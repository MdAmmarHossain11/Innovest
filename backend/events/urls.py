from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyEventViewSet

router = DefaultRouter()
router.register(r'events', CompanyEventViewSet, basename='company-event')

urlpatterns = [
    path('', include(router.urls)),
] 