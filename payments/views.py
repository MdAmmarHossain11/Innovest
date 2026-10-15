from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from companies.models import Company
from backend.models import CompanyPayment
import json
import requests
import uuid
import logging
import traceback
import time
from rest_framework.views import APIView
from chat.models import ChatRequest
from authentication.models import CustomUser

logger = logging.getLogger(__name__)

# Create your views here.

@csrf_exempt
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    try:
        # Log request details
        logger.info("=== Payment Initiation Request ===")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request headers: {dict(request.headers)}")
        logger.info(f"Request user: {request.user}")
        logger.info(f"Request data: {json.dumps(request.data, indent=2)}")
        
        # Validate required fields
        required_fields = ['amount', 'payment_method', 'company_id', 'user_id', 'phone_number']
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            logger.error(error_msg)
            return Response(
                {
                    'error': 'Missing required fields',
                    'details': error_msg,
                    'missing_fields': missing_fields
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify user_id matches authenticated user
        if str(request.user.id) != str(request.data['user_id']):
            error_msg = f"User ID mismatch: request user_id={request.data['user_id']}, authenticated user_id={request.user.id}"
            logger.error(error_msg)
            return Response(
                {
                    'error': 'User ID mismatch',
                    'details': error_msg
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate a unique transaction ID
        transaction_id = f"INV-{request.user.id}-{int(time.time())}"
        logger.info(f"Generated transaction ID: {transaction_id}")

        # Create payment record in database
        try:
            payment = CompanyPayment.objects.create(
                user=request.user,
                company_id=request.data['company_id'],
                amount=request.data['amount'],
                payment_method=request.data['payment_method'],
                #payment_method='sslcommerz',
                transaction_id=transaction_id,
                payment_status='unpaid'
            )
            logger.info(f"Created payment record with ID: {payment.payment_id}")
        except Exception as e:
            logger.error(f"Error creating payment record: {str(e)}")
            return Response(
                {
                    'error': 'Failed to create payment record',
                    'details': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Verify SSLCommerz settings
        if not hasattr(settings, 'SSLCOMMERZ_STORE_ID') or not hasattr(settings, 'SSLCOMMERZ_STORE_PASS'):
            error_msg = "SSLCommerz settings are not configured"
            logger.error(error_msg)
            return Response(
                {
                    'error': 'Payment gateway configuration error',
                    'details': error_msg
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Get frontend URL for callbacks
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        logger.info(f"Using frontend URL for callbacks: {frontend_url}")

        # Prepare SSLCommerz API request data
        try:
            amount = float(request.data['amount'])
        except (ValueError, TypeError) as e:
            error_msg = f"Invalid amount value: {request.data['amount']}"
            logger.error(error_msg)
            return Response(
                {
                    'error': 'Invalid amount value',
                    'details': error_msg
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get user details safely
        user = request.user
        user_name = user.get_full_name() or user.email
        user_email = user.email
        user_address = request.data.get('address', 'Not Provided')
        user_city = request.data.get('city', 'Not Provided')
        user_postal_code = request.data.get('postal_code', '1204')
        user_country = request.data.get('country', 'Bangladesh')
        user_phone = request.data['phone_number']

        # Validate address information
        if not user_address or user_address.strip() == '':
            error_msg = "Address is required"
            logger.error(error_msg)
            return Response(
                {
                    'error': 'Invalid address',
                    'details': error_msg
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate phone number
        if not user_phone or not user_phone.strip():
            error_msg = "Phone number is required"
            logger.error(error_msg)
            return Response(
                {
                    'error': 'Invalid phone number',
                    'details': error_msg
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Format phone number to ensure it starts with country code
        if not user_phone.startswith('+') and not user_phone.startswith('88'):
            user_phone = f"88{user_phone}"

        sslcommerz_data = {
            'store_id': settings.SSLCOMMERZ_STORE_ID,
            'store_passwd': settings.SSLCOMMERZ_STORE_PASS,
            'total_amount': amount,
            'currency': 'BDT',
            'tran_id': transaction_id,
            'product_category': 'Investment',
            'success_url': f"{getattr(settings, 'BACKEND_URL', 'http://localhost:8000')}/api/payments/success/",
            'fail_url': f"{getattr(settings, 'BACKEND_URL', 'http://localhost:8000')}/api/payments/fail/",
            'cancel_url': f"{getattr(settings, 'BACKEND_URL', 'http://localhost:8000')}/api/payments/cancel/",
            'emi_option': 0,
            'cus_name': user_name,
            'cus_email': user_email,
            'cus_add1': user_address,
            'cus_city': user_city,
            'cus_postcode': user_postal_code,
            'cus_country': user_country,
            'cus_phone': user_phone,
            'shipping_method': 'NO',
            'product_name': 'Investment',
            'product_profile': 'general',
            'product_amount': amount,
        }

        # Log the SSLCommerz request data (excluding sensitive info)
        safe_data = {k: v for k, v in sslcommerz_data.items() if k not in ['store_passwd']}
        logger.info(f"SSLCommerz request data: {json.dumps(safe_data, indent=2)}")

        # Make request to SSLCommerz API
        sslcommerz_url = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
        if not getattr(settings, 'SSLCOMMERZ_SANDBOX', True):
            sslcommerz_url = 'https://secure.sslcommerz.com/gwprocess/v4/api.php'
        
        logger.info(f"Using SSLCommerz URL: {sslcommerz_url}")

        try:
            # Convert amount to string with 2 decimal places
            sslcommerz_data['total_amount'] = f"{amount:.2f}"
            sslcommerz_data['product_amount'] = f"{amount:.2f}"
            
            # Ensure phone number is properly formatted
            if not user_phone.startswith('+') and not user_phone.startswith('88'):
                user_phone = f"88{user_phone}"
            sslcommerz_data['cus_phone'] = user_phone

            # Log the final request data
            safe_data = {k: v for k, v in sslcommerz_data.items() if k not in ['store_passwd']}
            logger.info(f"Final SSLCommerz request data: {json.dumps(safe_data, indent=2)}")

            response = requests.post(sslcommerz_url, data=sslcommerz_data)
            logger.info(f"SSLCommerz response status: {response.status_code}")
            logger.info(f"SSLCommerz response headers: {dict(response.headers)}")
            logger.info(f"SSLCommerz response content: {response.text}")

            if response.status_code != 200:
                error_msg = f"SSLCommerz returned non-200 status: {response.status_code}"
                logger.error(error_msg)
                return Response({
                    'error': 'Payment gateway error',
                    'details': error_msg,
                    'status_code': response.status_code,
                    'response_text': response.text
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            try:
                response_data = response.json()
                logger.info(f"Parsed SSLCommerz response: {json.dumps(response_data, indent=2)}")
                
                # Check if the response indicates success
                if response_data.get('status') == 'SUCCESS' or response_data.get('status') == 'VALID':
                    gateway_url = response_data.get('GatewayPageURL')
                    if not gateway_url:
                        error_msg = "Gateway URL not found in response"
                        logger.error(error_msg)
                        return Response({
                            'error': 'Payment gateway error',
                            'details': error_msg,
                            'response_data': response_data
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    logger.info("Payment initiated successfully")
                    return Response({
                        'gateway_url': gateway_url,
                        'transaction_id': transaction_id
                    })
                else:
                    error_msg = response_data.get('failedreason', 'Unknown error')
                    error_code = response_data.get('error_code', '')
                    logger.error(f"SSLCommerz error: {error_msg} (Code: {error_code})")
                    return Response({
                        'error': 'Payment gateway error',
                        'details': error_msg,
                        'error_code': error_code,
                        'response_data': response_data
                    }, status=status.HTTP_400_BAD_REQUEST)
            except json.JSONDecodeError as e:
                error_msg = f"Invalid JSON response from SSLCommerz: {response.text}"
                logger.error(error_msg)
                return Response({
                    'error': 'Invalid response from payment gateway',
                    'details': error_msg,
                    'response_text': response.text
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except requests.RequestException as e:
            error_msg = f"SSLCommerz request failed: {str(e)}"
            logger.error(error_msg)
            return Response({
                'error': 'Failed to connect to payment gateway',
                'details': error_msg
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error("=== Payment Initiation Error ===")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error message: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return Response({
            'error': 'Internal server error',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def send_payment_confirmation_email(payment, company_name):
    try:
        logger.info("=== Starting Payment Confirmation Email ===")
        logger.info(f"Payment ID: {payment.payment_id}")
        logger.info(f"Company Name: {company_name}")
        logger.info(f"User Email: {payment.user.email}")
        
        subject = f'Payment Confirmation - Investment in {company_name}'
        logger.info(f"Email Subject: {subject}")
        
        # Prepare email context
        context = {
            'company_name': company_name,
            'amount': payment.amount,
            'transaction_id': payment.transaction_id,
            'date': payment.payment_date.strftime('%B %d, %Y'),
            'user_name': payment.user.get_full_name() or payment.user.email
        }
        logger.info(f"Email Context: {context}")
        
        # Render HTML email template
        try:
            html_message = render_to_string('payments/email/payment_confirmation.html', context)
            plain_message = strip_tags(html_message)
            logger.info("Email template rendered successfully")
        except Exception as e:
            logger.error(f"Error rendering email template: {str(e)}")
            logger.error(f"Template path: payments/email/payment_confirmation.html")
            raise
        
        # Send email
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[payment.user.email],
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f"Payment confirmation email sent successfully to {payment.user.email}")
            return True
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            logger.error(f"Email settings: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}, USER={settings.EMAIL_HOST_USER}")
            raise
            
    except Exception as e:
        logger.error(f"Error in send_payment_confirmation_email: {str(e)}")
        logger.error(traceback.format_exc())
        return False

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

        logger.info(f"Payment success callback received - Transaction ID: {tran_id}, Validation ID: {val_id}, Status: {status}")

        if not tran_id or not val_id:
            logger.error("Missing transaction ID or validation ID")
            return HttpResponse("Invalid request parameters")

        # Update payment status in database
        try:
            payment = CompanyPayment.objects.get(transaction_id=tran_id)
            payment.payment_status = 'paid'
            payment.save()
            logger.info(f"Updated payment status to paid for transaction ID: {tran_id}")

            # Get company name
            try:
                company = Company.objects.get(id=payment.company_id)
                company_name = company.product_name
            except Company.DoesNotExist:
                company_name = "Unknown Company"

            # Send confirmation email
            send_payment_confirmation_email(payment, company_name)

        except CompanyPayment.DoesNotExist:
            logger.error(f"Payment record not found for transaction ID: {tran_id}")
            return HttpResponse("Payment record not found")
        except Exception as e:
            logger.error(f"Error updating payment status: {str(e)}")
            return HttpResponse("Error updating payment status")

        # Redirect to frontend success page
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return HttpResponseRedirect(f"{frontend_url}/payment/success?tran_id={tran_id}&val_id={val_id}&status={status}")

    except Exception as e:
        logger.error(f"Payment success callback error: {str(e)}")
        logger.error(traceback.format_exc())
        return HttpResponse("Internal server error")

@csrf_exempt
@api_view(['POST', 'GET'])
@authentication_classes([])
@permission_classes([])
def payment_fail(request):
    try:
        tran_id = request.GET.get('tran_id') or request.POST.get('tran_id')
        logger.info(f"Payment failed for transaction ID: {tran_id}")

        # Update payment status in database
        try:
            payment = CompanyPayment.objects.get(transaction_id=tran_id)
            payment.payment_status = 'unpaid'
            payment.save()
            logger.info(f"Updated payment status to unpaid for transaction ID: {tran_id}")
        except CompanyPayment.DoesNotExist:
            logger.error(f"Payment record not found for transaction ID: {tran_id}")
        except Exception as e:
            logger.error(f"Error updating payment status: {str(e)}")

        # Redirect to frontend fail page
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return HttpResponseRedirect(f"{frontend_url}/payment/fail?tran_id={tran_id}")

    except Exception as e:
        logger.error(f"Payment fail callback error: {str(e)}")
        logger.error(traceback.format_exc())
        return HttpResponse("Internal server error")

@csrf_exempt
@api_view(['POST', 'GET'])
@authentication_classes([])
@permission_classes([])
def payment_cancel(request):
    try:
        tran_id = request.GET.get('tran_id') or request.POST.get('tran_id')
        logger.info(f"Payment cancelled for transaction ID: {tran_id}")

        # Update payment status in database
        try:
            payment = CompanyPayment.objects.get(transaction_id=tran_id)
            payment.payment_status = 'unpaid'
            payment.save()
            logger.info(f"Updated payment status to unpaid for transaction ID: {tran_id}")
        except CompanyPayment.DoesNotExist:
            logger.error(f"Payment record not found for transaction ID: {tran_id}")
        except Exception as e:
            logger.error(f"Error updating payment status: {str(e)}")

        # Redirect to frontend cancel page
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        return HttpResponseRedirect(f"{frontend_url}/payment/cancel?tran_id={tran_id}")

    except Exception as e:
        logger.error(f"Payment cancel callback error: {str(e)}")
        logger.error(traceback.format_exc())
        return HttpResponse("Internal server error")

class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Log the raw request data
            logger.info(f"Raw request data: {request.data}")

            # Get parameters with fallback to alternative names
            tran_id = (
                request.data.get('tran_id') or 
                request.data.get('tranId') or 
                request.data.get('transaction_id') or 
                request.data.get('transactionId')
            )
            investment_id = (
                request.data.get('investment_id') or 
                request.data.get('investmentId') or 
                request.data.get('company_id') or 
                request.data.get('companyId')
            )
            amount = request.data.get('amount')
            status_value = request.data.get('status')

            # Log the extracted parameters
            logger.info(f"Extracted parameters:")
            logger.info(f"- Transaction ID: {tran_id}")
            logger.info(f"- Investment ID: {investment_id}")
            logger.info(f"- Amount: {amount}")
            logger.info(f"- Status: {status_value}")

            # Validate required parameters
            missing_params = []
            if not tran_id:
                missing_params.append('transaction_id')
            if not investment_id:
                missing_params.append('investment_id')
            if not amount:
                missing_params.append('amount')

            if missing_params:
                error_msg = f"Missing required parameters: {', '.join(missing_params)}"
                logger.error(error_msg)
                return Response({
                    'success': False,
                    'message': error_msg,
                    'details': {
                        'tran_id': tran_id,
                        'investment_id': investment_id,
                        'amount': amount,
                        'status': status_value
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get the payment record
            try:
                payment = CompanyPayment.objects.get(transaction_id=tran_id)
                logger.info(f"Found payment record: {payment.payment_id}")
            except CompanyPayment.DoesNotExist:
                logger.error(f"Payment record not found for transaction ID: {tran_id}")
                return Response({
                    'success': False,
                    'message': 'Payment record not found'
                }, status=status.HTTP_404_NOT_FOUND)

            # Update payment status
            payment.payment_status = 'paid'
            payment.save()
            logger.info(f"Updated payment status to paid for transaction ID: {tran_id}")

            # Get company details
            try:
                company = Company.objects.get(id=investment_id)
                logger.info(f"Found company: {company.product_name}")
            except Company.DoesNotExist:
                logger.error(f"Company not found for ID: {investment_id}")
                return Response({
                    'success': False,
                    'message': 'Company not found'
                }, status=status.HTTP_404_NOT_FOUND)

            # Get the payment date - try different possible field names
            payment_date = None
            for field in ['payment_date', 'created_at', 'created', 'date_created', 'timestamp']:
                if hasattr(payment, field):
                    payment_date = getattr(payment, field)
                    break

            if not payment_date:
                # If no date field is found, use current time
                from django.utils import timezone
                payment_date = timezone.now()

            # Prepare response data
            response_data = {
                'success': True,
                'message': 'Payment verified successfully',
                'payment_status': payment.payment_status,
                'transaction_id': tran_id,
                'company_name': company.product_name,
                'amount': amount,
                'date': payment_date.strftime('%Y-%m-%d %H:%M:%S')
            }

            logger.info(f"Payment verification successful - Response data: {response_data}")

            # --- ChatRequest creation logic ---
            try:
                from_user = payment.user
                to_user_id = company.user_id  # This is the owner's user id (int)
                # Defensive: get the user instance
                to_user = CustomUser.objects.get(id=to_user_id)
                # Only create if not already exists in either direction
                chat_request, created = ChatRequest.objects.get_or_create(
                    from_user=from_user,
                    to_user=to_user,
                    defaults={'status': 'accepted'}
                )
                if not created and chat_request.status != 'accepted':
                    chat_request.status = 'accepted'
                    chat_request.save()
                logger.info(f"ChatRequest created/updated: {chat_request.id} (from {from_user.id} to {to_user.id})")
            except Exception as e:
                logger.error(f"Error creating ChatRequest after payment: {str(e)}")
            # --- End ChatRequest logic ---

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error verifying payment: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                'success': False,
                'message': f'Error verifying payment: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def payment_list_create(request):
    if request.method == 'POST':
        try:
            # Validate required fields
            required_fields = ['company_id', 'amount', 'payment_method', 'transaction_id', 'payment_status']
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                return Response({
                    'error': 'Missing required fields',
                    'details': f"Missing fields: {', '.join(missing_fields)}"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create payment record
            payment = Payment.objects.create(
                user=request.user,
                company_id=request.data['company_id'],
                amount=request.data['amount'],
                payment_method=request.data['payment_method'],
                transaction_id=request.data['transaction_id'],
                payment_status=request.data['payment_status']
            )

            return Response({
                'success': True,
                'payment_id': payment.payment_id,
                'message': 'Payment record created successfully'
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Payment creation error: {str(e)}")
            return Response({
                'error': 'Failed to create payment record',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'GET':
        try:
            # Check if user is admin
            if request.user.is_platform_admin:
                # Admin can see all payments
                payments = Payment.objects.all()
            else:
                # Regular users can only see their own payments
                payments = Payment.objects.filter(user=request.user)
                
            return Response({
                'success': True,
                'payments': [{
                    'payment_id': payment.payment_id,
                    'company_id': payment.company_id,
                    'amount': payment.amount,
                    'payment_method': payment.payment_method,
                    'transaction_id': payment.transaction_id,
                    'payment_status': payment.payment_status,
                    'payment_date': payment.payment_date,
                    'user_id': payment.user_id,  # Include user_id for admin reference
                    'user_email': payment.user.email if payment.user else None  # Include user email for admin reference
                } for payment in payments]
            })
        except Exception as e:
            logger.error(f"Payment list error: {str(e)}")
            return Response({
                'error': 'Failed to fetch payment records',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_company_user_payment(request, company_id, user_id):
    try:
        payment = Payment.objects.filter(company_id=company_id, user_id=user_id).first()
        if not payment:
            return Response({'detail': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)
        payment.delete()
        return Response({'detail': 'User payment deleted.'}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
