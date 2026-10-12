from django.urls import path
from .views import CommunityPostCreateView, CommunityCommentView, toggle_interest, community_notifications, get_unread_notification_count

urlpatterns = [
    path('posts/', CommunityPostCreateView.as_view(), name='communitypost-create'),
    path('posts/<int:pk>/', CommunityPostCreateView.as_view(), name='communitypost-detail'),
    path('comments/', CommunityCommentView.as_view(), name='communitycomment-list'),
    path('comments/<int:comment_id>/', CommunityCommentView.as_view(), name='communitycomment-detail'),
    path('posts/<int:post_id>/comments/', CommunityCommentView.as_view(), name='communitycomment-create'),
    path('posts/<int:post_id>/toggle-interest/', toggle_interest, name='toggle-interest'),
    path('notifications/', community_notifications, name='community-notifications'),
    path('notifications/unread-count/', get_unread_notification_count, name='community-unread-count'),
] 