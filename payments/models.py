from django.db import models
from django.conf import settings

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_column='user_id')
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, db_column='company_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.TextField()
    transaction_id = models.TextField(unique=True)
    payment_status = models.TextField(choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')])
    payment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_payment'
        managed = False  # Since the table already exists
