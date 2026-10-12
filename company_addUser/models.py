from django.db import models

# Create your models here.

class CompanyPayment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user_id = models.BigIntegerField()
    company_id = models.BigIntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.TextField()
    transaction_id = models.TextField(unique=True)
    payment_status = models.TextField()
    payment_date = models.DateTimeField(auto_now_add=False, null=True)

    class Meta:
        managed = False
        db_table = 'companies_payment'

class ChatChatRequest(models.Model):
    id = models.AutoField(primary_key=True)
    status = models.CharField(max_length=16)
    created_at = models.DateTimeField()
    responded_at = models.DateTimeField(null=True, blank=True)
    from_user_id = models.BigIntegerField()
    to_user_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'chat_chatrequest'
