from django.urls import path
from . import views
from .model_status import ModelStatusView

urlpatterns = [
    path('train/', views.TrainModelView.as_view(), name='train-model'),
    path('predict/', views.PredictProfitabilityView.as_view(), name='predict-profitability'),
    path('model-status/', ModelStatusView.as_view(), name='model-status'),
]
