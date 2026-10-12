from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ContactSerializer
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import logging
import socket
from smtplib import SMTPException

logger = logging.getLogger(__name__)

# Create your views here.

class TestEmailView(APIView):
    def get(self, request):
        try:
            # Send a test email
            send_mail(
                subject='Test Email from Innovest',
                message='This is a test email to verify email settings.',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
            return Response({"message": "Test email sent successfully!"})
        except Exception as e:
            logger.error(f"Test email error: {str(e)}")
            return Response(
                {
                    "message": f"Failed to send test email: {str(e)}",
                    "status": "error"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ContactView(APIView):
    def post(self, request):
        logger.info("Received contact form submission")
        logger.info(f"Request data: {request.data}")
        
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Save to database
                contact = serializer.save()
                logger.info(f"Saved contact form to database with ID: {contact.id}")
                
                # Prepare email content
                subject = f"New Contact Message: {contact.subject}"
                context = {
                    'name': contact.name,
                    'email': contact.email,
                    'phone': contact.phone,
                    'subject': contact.subject,
                    'message': contact.message,
                }
                
                try:
                    # Render HTML content
                    html_content = render_to_string('contact/email_template.html', context)
                    text_content = strip_tags(html_content)
                    logger.info("Email template rendered successfully")

                    # Create email message
                    email = EmailMultiAlternatives(
                        subject=subject,
                        body=text_content,
                        from_email=settings.EMAIL_HOST_USER,
                        to=[settings.EMAIL_HOST_USER],
                        reply_to=[contact.email]
                    )
                    
                    # Attach HTML content
                    email.attach_alternative(html_content, "text/html")
                    
                    try:
                        # Set timeout for SMTP connection
                        socket.setdefaulttimeout(30)
                        # Send email
                        email.send(fail_silently=False)
                        logger.info("Email sent successfully")
                        
                        return Response(
                            {
                                "message": "Thank you for your message! We will get back to you within 24-48 hours.",
                                "status": "success"
                            },
                            status=status.HTTP_201_CREATED
                        )
                    
                    except SMTPException as smtp_error:
                        logger.error(f"SMTP error: {str(smtp_error)}")
                        return Response(
                            {
                                "message": "Unable to send email. Please try again later.",
                                "error": str(smtp_error),
                                "status": "error"
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                    except socket.timeout:
                        logger.error("Email sending timed out")
                        return Response(
                            {
                                "message": "Connection timed out. Please try again.",
                                "status": "error"
                            },
                            status=status.HTTP_504_GATEWAY_TIMEOUT
                        )
                    except Exception as email_error:
                        logger.error(f"Email sending error: {str(email_error)}")
                        return Response(
                            {
                                "message": f"Email sending failed: {str(email_error)}",
                                "status": "error"
                            },
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                        
                except Exception as template_error:
                    logger.error(f"Template rendering error: {str(template_error)}")
                    return Response(
                        {
                            "message": f"Template error: {str(template_error)}",
                            "status": "error"
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                    
            except Exception as e:
                logger.error(f"General error: {str(e)}")
                return Response(
                    {
                        "message": f"An error occurred: {str(e)}",
                        "status": "error",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            {
                "message": "Please correct the errors in the form.",
                "status": "error",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
