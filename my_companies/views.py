from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Company, FundraiseTerms, BusinessPlan
from .serializers import CompanySerializer, FundraiseTermsSerializer, BusinessPlanSerializer
import logging
import json

logger = logging.getLogger(__name__)


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Log the raw request data
            logger.debug("Raw request data:")
            for key, value in request.data.items():
                logger.debug(f"{key}: {value}")

            # Log the request content type
            logger.debug(f"Content-Type: {request.content_type}")

            # Company ownership comes from the authenticated account, not form data.
            request_data = request.data.copy()
            request_data['user_id'] = request.user.id
            serializer = self.get_serializer(data=request_data)
            if not serializer.is_valid():
                logger.error("Validation errors:")
                for field, errors in serializer.errors.items():
                    logger.error(f"{field}: {errors}")
                return Response({
                    'status': 'error',
                    'message': serializer.errors,
                    'data': request.data
                }, status=status.HTTP_400_BAD_REQUEST)

            self.perform_create(serializer)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating company: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e),
                'data': request.data
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        # For detail views (retrieve, destroy, update), don't filter by user/status
        if getattr(self, 'action', None) in ['retrieve', 'destroy', 'update', 'partial_update']:
            return Company.objects.all()
        user_id = self.request.query_params.get('user')
        if user_id:
            return Company.objects.filter(user_id=user_id).order_by('-created_at')
        return Company.objects.filter(company_status='Approved').order_by('-created_at')

    def list(self, request):
        try:
            companies = self.get_queryset()
            logger.debug(f"Companies found: {companies.count()}")
            serializer = self.get_serializer(companies, many=True)
            logger.debug(f"Serialized data: {serializer.data}")

            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in list view: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def browse(self, request):
        """
        Endpoint for browsing companies with optional filters
        """
        try:
            queryset = self.get_queryset()

            # Apply filters if provided
            industry = request.query_params.get('industry', None)
            if industry:
                queryset = queryset.filter(industry=industry)

            location = request.query_params.get('location', None)
            if location:
                queryset = queryset.filter(city__icontains=location)

            status = request.query_params.get('status', None)
            if status:
                queryset = queryset.filter(company_status=status)

            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({
                'status': 'success',
                'message': 'Company deleted successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FundraiseTermsViewSet(viewsets.ModelViewSet):
    queryset = FundraiseTerms.objects.all()
    serializer_class = FundraiseTermsSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = FundraiseTerms.objects.all()
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset


class BusinessPlanViewSet(viewsets.ModelViewSet):
    queryset = BusinessPlan.objects.all()
    serializer_class = BusinessPlanSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = BusinessPlan.objects.all()
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset
