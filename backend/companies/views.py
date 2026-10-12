from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Company, CompanyPayment
from .serializers import CompanySerializer, CompanyPaymentSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from django.db.models import Sum
import logging
import json

logger = logging.getLogger(__name__)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to view companies

    def get_queryset(self):
        """
        Filter companies based on privacy status, company status, and user authentication.
        """
        queryset = Company.objects.filter(company_status='Approved').order_by('-created_at')
        # Debug logging for companies and their fundraise terms
        for company in queryset:
            fundraise_terms = company.get_fundraise_terms()  # Use the method from Company model
            logger.debug(f"Company ID: {company.id}, Name: {company.product_name}")
            if fundraise_terms:
                logger.debug(f"Fundraise Terms found - Raise Amount: {fundraise_terms.raise_amount}, "
                           f"Valuation: {fundraise_terms.pre_money_valuation}, "
                           f"Max Investors: {fundraise_terms.max_investors}")
            else:
                logger.debug("No fundraise terms found for this company")
        return queryset

    def list(self, request):
        """
        List all companies with proper error handling
        """
        try:
            companies = self.get_queryset()
            logger.debug(f"Companies found: {companies.count()}")
            serializer = self.get_serializer(companies, many=True)
            serialized_data = serializer.data
            logger.debug(f"Serialized data: {json.dumps(serialized_data, indent=2)}")
            
            return Response({
                'status': 'success',
                'data': serialized_data
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
                queryset = queryset.filter(location__icontains=location)
                
            privacy = request.query_params.get('privacy_status', None)
            if privacy:
                queryset = queryset.filter(privacy_status=privacy)

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

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a company instance with proper error handling
        """
        try:
            company = self.get_queryset().get(pk=kwargs['pk'])
            serializer = self.get_serializer(company)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Company.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='total_payments')
    def total_payments(self, request, pk=None):
        try:
            company = self.get_object()
            logger.info(f"Getting total payments for company: {company.id} - {company.product_name}")
            
            payments = CompanyPayment.objects.filter(
                company=company,
                payment_status='paid'
            )
            logger.info(f"Found {payments.count()} paid payments")
            
            total = payments.aggregate(total=Sum('amount'))['total']
            logger.info(f"Total amount: {total}")
            
            return Response({
                'status': 'success',
                'total': float(total) if total else 0
            })
        except Company.DoesNotExist:
            logger.error(f"Company not found with ID: {pk}")
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting total payments: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='paid_investors_count')
    def paid_investors_count(self, request, pk=None):
        try:
            company = self.get_object()
            logger.info(f"Getting paid investors count for company: {company.id} - {company.product_name}")
            
            # Count distinct users who have paid payments for this company
            paid_investors_count = CompanyPayment.objects.filter(
                company=company,
                payment_status='paid'
            ).values('user').distinct().count()
            
            logger.info(f"Found {paid_investors_count} paid investors for company {company.id}")
            
            return Response({
                'status': 'success',
                'count': paid_investors_count
            })
        except Company.DoesNotExist:
            logger.error(f"Company not found with ID: {pk}")
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting paid investors count: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='user_payments')
    def user_payments(self, request, pk=None):
        try:
            company = self.get_object()
            logger.info(f"Getting user payments for company: {company.id} - {company.product_name}")
            
            if not request.user.is_authenticated:
                return Response({
                    'status': 'error',
                    'message': 'Authentication required'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Get all payments for this company (not just current user)
            payments = CompanyPayment.objects.filter(
                company=company
            ).select_related('user')  # Include user details in the query
            
            logger.info(f"Found {payments.count()} payments for company {company.id}")
            
            serializer = CompanyPaymentSerializer(payments, many=True)
            return Response(serializer.data)
        except Company.DoesNotExist:
            logger.error(f"Company not found with ID: {pk}")
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting user payments: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CompanyListView(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(privacy_status='public')

class CompanyPaymentViewSet(viewsets.ModelViewSet):
    queryset = CompanyPayment.objects.all()
    serializer_class = CompanyPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter payments by the authenticated user
        return CompanyPayment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the user to the authenticated user
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        transaction_id = request.data.get('transaction_id')
        payment_status = request.data.get('status')

        try:
            payment = CompanyPayment.objects.get(transaction_id=transaction_id)
            
            if payment_status == 'VALID':
                payment.payment_status = 'paid'
                payment.save()
                return Response({
                    'status': 'success',
                    'message': 'Payment verified successfully'
                })
            else:
                payment.payment_status = 'unpaid'
                payment.save()
                return Response({
                    'status': 'error',
                    'message': 'Payment verification failed'
                }, status=status.HTTP_400_BAD_REQUEST)

        except CompanyPayment.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Payment not found'
            }, status=status.HTTP_404_NOT_FOUND) 