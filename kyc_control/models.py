from django.db import models

# Create your models here.

class CustomUserKYC(models.Model):
    id = models.AutoField(primary_key=True)
    company_id = models.BigIntegerField()
    user_id = models.BigIntegerField()
    name = models.TextField()
    email = models.TextField()
    phone_number = models.TextField()
    date_of_birth = models.TextField()
    address = models.TextField()
    city = models.TextField()
    country = models.TextField()
    id_type = models.TextField()
    id_document_path = models.TextField()
    address_proof_type = models.TextField()
    address_proof_path = models.TextField()
    business_name = models.TextField(blank=True, null=True)
    business_registration_number = models.TextField(blank=True, null=True)
    entity_type = models.TextField(blank=True, null=True)
    source_of_funds = models.TextField()
    declaration = models.TextField()
    signature_path = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=False, null=True)

    class Meta:
        managed = False
        db_table = 'authentication_customuser_kyc'
