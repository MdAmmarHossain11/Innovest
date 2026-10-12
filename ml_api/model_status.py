from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
import os
import json
from django.conf import settings

class ModelStatusView(APIView):
    """API endpoint to check if the model is trained and get its status"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Check if model info file exists
            model_info_path = os.path.join(settings.BASE_DIR, 'ml_api', 'model_info.json')
            
            if not os.path.exists(model_info_path):
                return Response(
                    {
                        'is_trained': False,
                        'message': 'Model has not been trained yet',
                        'model_path': model_info_path
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Load model info
            with open(model_info_path, 'r') as f:
                model_info = json.load(f)
            
            response_data = {
                'is_trained': True,
                'message': 'Model is trained and ready for predictions',
                'model_type': 'RandomForestClassifier',
                'last_trained': model_info.get('training_date'),
                'test_accuracy': model_info.get('test_accuracy'),
                'samples_trained': model_info.get('samples_trained')
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {
                    'is_trained': False,
                    'message': 'Error checking model status',
                    'error': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
