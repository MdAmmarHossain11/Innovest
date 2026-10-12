from django.urls import path
from .views import initiate_payment, payment_success, payment_fail, payment_cancel, VerifyPaymentView, payment_list_create

urlpatterns = [
    path('initiate/', initiate_payment, name='initiate_payment'),
    path('success/', payment_success, name='payment_success'),
    path('fail/', payment_fail, name='payment_fail'),
    path('cancel/', payment_cancel, name='payment_cancel'),
    path('verify_payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('list/', payment_list_create, name='payment_list'),
] 