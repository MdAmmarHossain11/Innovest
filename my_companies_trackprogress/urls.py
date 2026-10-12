from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('track-progress/', views.CompanyTrackProgressListCreateView.as_view(), name='track-progress-list-create'),
    path('track-progress/<int:pk>/', views.CompanyTrackProgressRetrieveUpdateView.as_view(), name='track-progress-detail'),
    path('company-update/', views.CompanyUpdateListCreateView.as_view(), name='company-update-list-create'),
    path('company-update/<int:pk>/', views.CompanyUpdateRetrieveUpdateView.as_view(), name='company-update-detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)