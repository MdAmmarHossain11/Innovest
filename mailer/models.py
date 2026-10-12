from django.db import models

# Create your models here.

class Email(models.Model):
    recipient = models.EmailField()
    cc = models.EmailField(blank=True, null=True)
    bcc = models.EmailField(blank=True, null=True)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Email to {self.recipient} - {self.subject}"
