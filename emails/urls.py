from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyContactViewSet, BulkDeleteContactView

router = DefaultRouter()
router.register(r'company-contacts', CompanyContactViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('bulk-delete/', BulkDeleteContactView.as_view(), name='bulk-delete-contact'),
]
