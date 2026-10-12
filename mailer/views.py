from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from .serializers import EmailSerializer
from django.conf import settings

# Create your views here.

class SendEmailView(APIView):
    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            recipient = serializer.validated_data['recipient']
            cc = serializer.validated_data.get('cc')
            bcc = serializer.validated_data.get('bcc')
            subject = serializer.validated_data['subject']
            body = serializer.validated_data['body']

            # Prepare email recipients
            recipient_list = [recipient]
            if cc:
                recipient_list.append(cc)
            if bcc:
                recipient_list.append(bcc)

            try:
                # Render HTML email content
                html_content = render_to_string('mailer/email_template.html', {
                    'subject': subject,
                    'recipient_name': recipient.split('@')[0].capitalize(),  # Simple name from email
                    'message_body': body,
                    'button_url': 'https://your-link.com',  # You can make this dynamic
                })
                text_content = body

                email = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[recipient],
                    cc=[cc] if cc else None,
                    bcc=[bcc] if bcc else None,
                )
                email.attach_alternative(html_content, "text/html")
                email.send()

                email_record = serializer.save()
                return Response({
                    'message': f'Email sent successfully to {recipient}',
                    'email_id': email_record.id,
                    'status': 'success'
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    'error': str(e),
                    'message': 'Failed to send email. Please check your email settings.',
                    'status': 'error'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({
            'error': serializer.errors,
            'message': 'Invalid email data provided',
            'status': 'error'
        }, status=status.HTTP_400_BAD_REQUEST)
