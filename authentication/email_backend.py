import logging

import requests
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail.backends.base import BaseEmailBackend

logger = logging.getLogger(__name__)


class ResendEmailBackend(BaseEmailBackend):
    api_url = 'https://api.resend.com/emails'

    def send_messages(self, email_messages):
        if not email_messages:
            return 0
        if not settings.RESEND_API_KEY:
            raise ImproperlyConfigured('RESEND_API_KEY is not configured.')
        if not settings.DEFAULT_FROM_EMAIL:
            raise ImproperlyConfigured('DEFAULT_FROM_EMAIL is not configured.')

        sent_count = 0
        for message in email_messages:
            recipients = message.recipients()
            if not recipients:
                continue

            payload = {
                'from': message.from_email or settings.DEFAULT_FROM_EMAIL,
                'to': recipients,
                'subject': message.subject,
                'text': message.body,
            }
            if message.cc:
                payload['cc'] = message.cc
            if message.bcc:
                payload['bcc'] = message.bcc
            if message.reply_to:
                payload['reply_to'] = message.reply_to
            html_body = next(
                (
                    alternative.content
                    for alternative in getattr(message, 'alternatives', ())
                    if alternative.mimetype == 'text/html'
                ),
                None,
            )
            if html_body:
                payload['html'] = html_body

            try:
                response = requests.post(
                    self.api_url,
                    json=payload,
                    headers={
                        'Authorization': f'Bearer {settings.RESEND_API_KEY}',
                        'Content-Type': 'application/json',
                    },
                    timeout=(5, 20),
                )
                response.raise_for_status()
            except requests.RequestException:
                logger.exception('Resend email delivery failed.')
                if self.fail_silently:
                    continue
                raise

            sent_count += 1
        return sent_count
