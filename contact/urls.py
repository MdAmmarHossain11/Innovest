from django.urls import path
from .views import ContactView, TestEmailView

urlpatterns = [
    path('api/contact/', ContactView.as_view(), name='contact'),
    path('api/test-email/', TestEmailView.as_view(), name='test-email'),
] 