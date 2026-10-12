from django.shortcuts import render
import random
import string
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from .models import CompanyPayment, ChatChatRequest
from companies.models import Company
from authentication.models import CustomUser

# Create your views here.

@api_view(['POST'])
def add_user_payment_and_chat(request):
    try:
        user_id = request.data.get('user_id')
        company_id = request.data.get('company_id')
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        if not all([user_id, company_id, amount, payment_method]):
            return Response({'success': False, 'message': 'Missing required fields'}, status=400)
        # Generate transaction_id in the format INV-<company_id>-<random_number>
        random_number = random.randint(1000000000, 9999999999)
        transaction_id = f"INV-{company_id}-{random_number}"
        # Insert into companies_payment
        CompanyPayment.objects.create(
            user_id=user_id,
            company_id=company_id,
            amount=amount,
            payment_method=payment_method,
            transaction_id=transaction_id,
            payment_status='paid',
            payment_date=timezone.now()
        )
        # Get company owner user_id
        try:
            company = Company.objects.get(id=company_id)
            owner_user_id = company.user_id
        except Company.DoesNotExist:
            return Response({'success': False, 'message': 'Company not found'}, status=404)
        # Insert into chat_chatrequest only if not already connected
        existing_chat = ChatChatRequest.objects.filter(from_user_id=user_id, to_user_id=owner_user_id).first()
        if not existing_chat:
            ChatChatRequest.objects.create(
                status='accepted',
                created_at=timezone.now(),
                responded_at=None,
                from_user_id=user_id,
                to_user_id=owner_user_id
            )
        return Response({'success': True, 'message': 'User payment and chat request added'})
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=500)
