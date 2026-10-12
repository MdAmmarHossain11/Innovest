from django.urls import path
from .views import add_user_payment_and_chat

urlpatterns = [
    path('add/', add_user_payment_and_chat, name='add-user-payment-and-chat'),
] 