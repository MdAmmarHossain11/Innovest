from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .predictor import predictor
import joblib
import os
from django.conf import settings
import json

class TrainModelView(APIView):
    """API endpoint to train the model"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Check if there's enough data to train the model
            try:
                df = predictor.load_data()
                if len(df) < 10:  # Minimum number of samples needed
                    return Response(
                        {"error": f"Not enough data to train the model. Need at least 10 samples, got {len(df)}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Train the model
                accuracy = predictor.train()
                
                # Save the trained model
                predictor.save_model()
                
                return Response(
                    {
                        "message": "Model trained and saved successfully",
                        "accuracy": accuracy,
                        "samples_used": len(df)
                    },
                    status=status.HTTP_200_OK
                )
                
            except Exception as e:
                return Response(
                    {"error": f"Error training model: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            return Response(
                {"error": f"Unexpected error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PredictProfitabilityView(APIView):
    """API endpoint to predict startup profitability"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Get input data from request
            input_data = request.data
            
            # Validate required fields
            required_fields = [
                'industry', 'funding_rounds', 'funding_amount_m_usd', 
                'valuation_m_usd', 'revenue_m_usd', 'employees',
                'market_share_percent', 'year_founded', 'region'
            ]
            
            for field in required_fields:
                if field not in input_data:
                    return Response(
                        {"error": f"Missing required field: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Make prediction
            result = predictor.predict(input_data)
            
            return Response({
                "is_profitable": result['is_profitable'],
                "probability": result['probability'],
                "key_factors": result.get('key_factors', []),
                "message": "Prediction successful"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
