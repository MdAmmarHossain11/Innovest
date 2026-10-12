from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from backend.models import CompanyBusinessPlan, CompanyFundraiseTerms, CompanyContact, CompanyPayment, Company, CustomUserKYC
from backend.serializers import CompanyBusinessPlanSerializer, CompanyFundraiseTermsSerializer, CompanyContactSerializer
import logging
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings
import traceback
import os
import uuid
from payments.views import send_payment_confirmation_email
from django.shortcuts import render
from django.db.models import Sum, Count
from django.db import OperationalError
from authentication.models import CustomUser
import json
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


class CompanyBusinessPlanViewSet(viewsets.ModelViewSet):
    queryset = CompanyBusinessPlan.objects.all()
    serializer_class = CompanyBusinessPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        company_id = self.request.query_params.get('company_id', None)
        if company_id:
            return CompanyBusinessPlan.objects.filter(company=company_id)
        return CompanyBusinessPlan.objects.none()

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()


class CompanyFundraiseTermsViewSet(viewsets.ModelViewSet):
    queryset = CompanyFundraiseTerms.objects.all()
    serializer_class = CompanyFundraiseTermsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        company_id = self.request.query_params.get('company_id')
        logger.info(f"Fetching fundraise terms for company_id: {company_id}")

        if not company_id:
            logger.warning("No company_id provided")
            return CompanyFundraiseTerms.objects.none()

        try:
            queryset = CompanyFundraiseTerms.objects.filter(
                company_id=company_id)
            logger.info(f"Found {queryset.count()} fundraise terms records")
            return queryset
        except Exception as e:
            logger.error(f"Error fetching fundraise terms: {str(e)}")
            return CompanyFundraiseTerms.objects.none()

    def list(self, request, *args, **kwargs):
        logger.info("List method called for fundraise terms")
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'count': queryset.count(),
                'next': None,
                'previous': None,
                'results': serializer.data
            })
        except Exception as e:
            logger.error(f"Error in list method: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CompanyContactView(APIView):
    def post(self, request):
        try:
            logger.info(f"Received contact form submission: {request.data}")
            serializer = CompanyContactSerializer(data=request.data)
            if serializer.is_valid():
                contact = serializer.save()
                logger.info(
                    f"Contact form saved successfully with ID: {contact.id}")
                return Response({
                    'message': 'Your message has been sent successfully!',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            logger.error(f"Validation error: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error processing contact form: {str(e)}")
            return Response({
                'message': 'An error occurred while processing your request.',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST', 'GET'])
@authentication_classes([])
@permission_classes([])
def payment_success(request):
    try:
        # Get payment parameters
        tran_id = request.GET.get('tran_id') or request.POST.get('tran_id')
        val_id = request.GET.get('val_id') or request.POST.get('val_id')
        status = request.GET.get('status') or request.POST.get('status')

        logger.info(
            f"Payment success callback received - Transaction ID: {tran_id}, Validation ID: {val_id}, Status: {status}")

        if not tran_id or not val_id:
            logger.error("Missing transaction ID or validation ID")
            return HttpResponse("Invalid request parameters")

        # Update payment status in database
        try:
            payment = CompanyPayment.objects.get(transaction_id=tran_id)
            payment.payment_status = 'paid'
            payment.save()
            logger.info(
                f"Updated payment status to paid for transaction ID: {tran_id}")

            # Get company name
            try:
                company = Company.objects.get(id=payment.company_id)
                company_name = company.product_name
            except Company.DoesNotExist:
                company_name = "Unknown Company"

            # Get KYC data from session storage
            kyc_data = request.session.get('kyc_data')
            if kyc_data:
                try:
                    # Create KYC record
                    kyc = CustomUserKYC.objects.create(
                        company_id=payment.company_id,
                        user_id=payment.user_id,
                        name=kyc_data.get('name'),
                        email=kyc_data.get('email'),
                        phone_number=kyc_data.get('phone_number'),
                        date_of_birth=kyc_data.get('date_of_birth'),
                        address=kyc_data.get('address'),
                        city=kyc_data.get('city'),
                        country=kyc_data.get('country'),
                        id_type=kyc_data.get('id_type'),
                        id_document_path=kyc_data.get('id_document'),
                        address_proof_type=kyc_data.get('address_proof_type'),
                        address_proof_path=kyc_data.get('address_proof'),
                        business_name=kyc_data.get('business_name'),
                        business_registration_number=kyc_data.get(
                            'business_registration_number'),
                        entity_type=kyc_data.get('entity_type'),
                        source_of_funds=kyc_data.get('source_of_funds'),
                        declaration=kyc_data.get('declaration'),
                        signature_path=kyc_data.get('signature')
                    )
                    logger.info(
                        f"Created KYC record for user {payment.user_id}")
                    # Clear KYC data from session
                    del request.session['kyc_data']
                except Exception as e:
                    logger.error(f"Error creating KYC record: {str(e)}")
                    logger.error(traceback.format_exc())
                    # Continue with payment success even if KYC creation fails
                    pass

            # Send confirmation email
            send_payment_confirmation_email(payment, company_name)

        except CompanyPayment.DoesNotExist:
            logger.error(
                f"Payment record not found for transaction ID: {tran_id}")
            return HttpResponse("Payment record not found")
        except Exception as e:
            logger.error(f"Error updating payment status: {str(e)}")
            return HttpResponse("Error updating payment status")

        # Redirect to frontend success page
        frontend_url = getattr(settings, 'FRONTEND_URL',
                               'http://localhost:3000')
        return HttpResponseRedirect(f"{frontend_url}/payment/success?tran_id={tran_id}&val_id={val_id}&status={status}")

    except Exception as e:
        logger.error(f"Payment success callback error: {str(e)}")
        logger.error(traceback.format_exc())
        return HttpResponse("Internal server error")


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def submit_kyc(request):
    try:
        logger.info("=== KYC Submission Request ===")
        logger.info(f"Request user: {request.user}")
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request files: {request.FILES}")

        existing_kyc = CustomUserKYC.objects.filter(
            user=request.user
        ).order_by('submitted_at', 'id').first()
        if existing_kyc:
            return Response({
                'success': True,
                'message': 'KYC data has already been submitted',
                'kyc_id': existing_kyc.id,
                'already_submitted': True,
            }, status=status.HTTP_200_OK)

        # Get company ID from request
        company_id = request.data.get('company_id')
        if not company_id:
            return Response({
                'success': False,
                'message': 'Company ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Handle file uploads
        id_document = request.FILES.get('id_document')
        address_proof = request.FILES.get('address_proof')
        signature = request.FILES.get('signature')

        if not all([id_document, address_proof, signature]):
            return Response({
                'success': False,
                'message': 'All required documents must be uploaded'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Save files and get their paths
        try:
            id_document_path = handle_uploaded_file(
                id_document, 'id_documents')
            address_proof_path = handle_uploaded_file(
                address_proof, 'address_proofs')
            signature_path = handle_uploaded_file(signature, 'signatures')
        except Exception as e:
            logger.error(f"Error handling file uploads: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                'success': False,
                'message': f'Error uploading files: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        # Create KYC record
        try:
            kyc_data = {
                'company_id': company_id,
                'user': request.user,
                'name': request.data.get('name'),
                'email': request.data.get('email'),
                'phone_number': request.data.get('phone_number'),
                'date_of_birth': request.data.get('date_of_birth'),
                'address': request.data.get('address'),
                'city': request.data.get('city'),
                'country': request.data.get('country'),
                'id_type': request.data.get('id_type'),
                'id_document_path': id_document_path,
                'address_proof_type': request.data.get('address_proof_type'),
                'address_proof_path': address_proof_path,
                'business_name': request.data.get('business_name'),
                'business_registration_number': request.data.get('business_registration_number'),
                'entity_type': request.data.get('entity_type'),
                'source_of_funds': request.data.get('source_of_funds'),
                'declaration': request.data.get('declaration'),
                'signature_path': signature_path
            }

            logger.info(f"Creating KYC record with data: {kyc_data}")

            kyc = CustomUserKYC.objects.create(**kyc_data)
            logger.info(f"Created KYC record with ID: {kyc.id}")

            return Response({
                'success': True,
                'message': 'KYC data submitted successfully',
                'kyc_id': kyc.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating KYC record: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                'success': False,
                'message': f'Error creating KYC record: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"KYC submission error: {str(e)}")
        logger.error(traceback.format_exc())
        return Response({
            'success': False,
            'message': f'Internal server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def kyc_status(request):
    kyc = CustomUserKYC.objects.filter(
        user=request.user
    ).order_by('submitted_at', 'id').first()
    if not kyc:
        return Response({'submitted': False})

    return Response({
        'submitted': True,
        'kyc': {
            'name': kyc.name,
            'email': kyc.email,
            'phone_number': kyc.phone_number,
            'date_of_birth': kyc.date_of_birth,
            'address': kyc.address,
            'city': kyc.city,
            'country': kyc.country,
            'id_type': kyc.id_type,
            'address_proof_type': kyc.address_proof_type,
            'business_name': kyc.business_name,
            'business_registration_number': kyc.business_registration_number,
            'entity_type': kyc.entity_type,
            'source_of_funds': kyc.source_of_funds,
        },
    })


def handle_uploaded_file(file, folder):
    """Handle file upload and return the file path"""
    try:
        # Create folder if it doesn't exist
        upload_dir = os.path.join(settings.MEDIA_ROOT, folder)
        os.makedirs(upload_dir, exist_ok=True)

        # Generate unique filename
        filename = f"{uuid.uuid4()}_{file.name}"
        file_path = os.path.join(folder, filename)

        # Save file
        with open(os.path.join(settings.MEDIA_ROOT, file_path), 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return file_path
    except Exception as e:
        logger.error(f"Error handling file upload: {str(e)}")
        logger.error(traceback.format_exc())
        raise


@api_view(['GET'])
@permission_classes([AllowAny])
def statistics(request):
    """
    Get platform statistics for the home page
    """
    try:
        total_companies = Company.objects.count()

        # Get total active users (excluding admins)
        total_users = CustomUser.objects.filter(
            is_active=True,
            user_type='user'
        ).count()

        try:
            paid_payments = CompanyPayment.objects.filter(
                payment_status='paid')
            active_investors = paid_payments.values(
                'user_id').distinct().count()
            funded_startups = paid_payments.values(
                'company_id').distinct().count()
        except OperationalError:
            active_investors = 0
            funded_startups = 0

        approved_companies = Company.objects.filter(
            company_status='Approved').count()
        success_rate = round(
            (approved_companies / total_companies) * 100) if total_companies else 0

        return Response({
            'status': 'success',
            'data': {
                'total_companies': total_companies,
                'total_users': active_investors or total_users,
                'total_paid_payments': funded_startups,
                'success_rate': success_rate
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error fetching statistics: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'Failed to fetch statistics'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
