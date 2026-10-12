from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.models import CompanyContact
import logging
import traceback

logger = logging.getLogger(__name__)

class ContactView(APIView):
    def post(self, request):
        try:
            logger.info(f"Received contact form data: {request.data}")
            
            # Validate required fields
            required_fields = ['name', 'email', 'message']
            for field in required_fields:
                if not request.data.get(field):
                    logger.warning(f"Missing required field: {field}")
                    return Response({
                        'error': f'{field.capitalize()} is required'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Create new contact entry
            try:
                contact = CompanyContact.objects.create(
                    name=request.data.get('name'),
                    email=request.data.get('email'),
                    phone=request.data.get('phone', ''),
                    subject=request.data.get('subject', 'Contact Form Submission'),
                    message=request.data.get('message')
                )
                logger.info(f"Contact form saved successfully with ID: {contact.id}")
                return Response({
                    'message': 'Your message has been saved successfully!',
                    'data': {
                        'id': contact.id,
                        'name': contact.name,
                        'email': contact.email,
                        'phone': contact.phone,
                        'subject': contact.subject,
                        'message': contact.message,
                        'created_at': contact.created_at
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as save_error:
                logger.error(f"Error saving contact: {str(save_error)}")
                logger.error(traceback.format_exc())
                return Response({
                    'error': 'Failed to save contact. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Contact form error: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                'error': 'An error occurred while saving your message. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 