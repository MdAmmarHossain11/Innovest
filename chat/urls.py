from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChatMessageViewSet,
    UsersView,
    ConversationView,
    SendMessageView,
    ChatRequestView
)

router = DefaultRouter()
router.register('messages', ChatMessageViewSet, basename='chat-message')

urlpatterns = [
    path('', include(router.urls)),
    # Custom action routes
    path('users/', UsersView.as_view(), name='chat-users'),
    path('my_requests/', ChatRequestView.as_view(), name='chat-my-requests'),
    path('send_request/', ChatRequestView.as_view(), name='chat-send-request'),
    path('respond_request/', ChatRequestView.as_view(), name='chat-respond-request'),
    path('conversation/', ConversationView.as_view(), name='chat-conversation'),
    path('send/', SendMessageView.as_view(), name='chat-send'),
] 