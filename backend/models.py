from django.db import models
from companies.models import Company
from authentication.models import CustomUser

class CompanyBusinessPlan(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='business_plans')
    executive_summary = models.TextField(null=True, blank=True)
    investment_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valuation = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    traction_item1 = models.TextField(null=True, blank=True)
    traction_item2 = models.TextField(null=True, blank=True)
    traction_item3 = models.TextField(null=True, blank=True)
    target_customer = models.TextField(null=True, blank=True)
    team_member1_name = models.TextField(null=True, blank=True)
    team_member1_title = models.TextField(null=True, blank=True)
    team_member1_bio = models.TextField(null=True, blank=True)
    team_member2_name = models.TextField(null=True, blank=True)
    team_member2_title = models.TextField(null=True, blank=True)
    team_member2_bio = models.TextField(null=True, blank=True)
    market_size_description = models.TextField(null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    contact_phone = models.CharField(max_length=20, null=True, blank=True)
    company_website = models.URLField(null=True, blank=True)
    funding_usage = models.TextField(null=True, blank=True)
    problem_description = models.TextField(null=True, blank=True)
    solution_description = models.TextField(null=True, blank=True)
    traction_description = models.TextField(null=True, blank=True)
    documents = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company_business_plan'

    def __str__(self):
        return f"Business Plan for {self.company.product_name}"

class CompanyFundraiseTerms(models.Model):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
    investment_type = models.CharField(max_length=20, choices=[
        ('equity', 'Equity'),
        ('convertible debt', 'Convertible Debt'),
        ('debt', 'Debt')
    ])
    raise_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    duration = models.CharField(max_length=100, default='Until Funded or Canceled')
    pre_money_valuation = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    previous_investments = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    valuation_cap_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    convertible_note_discount = models.DecimalField(max_digits=5, decimal_places=3, default=0)
    max_investors = models.IntegerField(default=0)
    min_investment_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    annual_interest_rate = models.DecimalField(max_digits=5, decimal_places=3, default=0)
    repayment_term = models.IntegerField(default=0)
    funding_committed_offline = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    fundraise_visibility = models.CharField(max_length=20, default='Private')
    additional_terms = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company_fundraise_terms'
        verbose_name = 'Company fundraise terms'
        verbose_name_plural = 'Company fundraise terms'

    def __str__(self):
        return f"Fundraise Terms for {self.company.product_name}"

class CompanyContact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    subject = models.CharField(max_length=200, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"

    class Meta:
        db_table = 'company_contact'
        verbose_name = 'Contact'
        verbose_name_plural = 'Contacts'
        ordering = ['-created_at'] 

class CompanyPayment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=100)
    transaction_id = models.CharField(max_length=255, unique=True)
    payment_status = models.CharField(
        max_length=10,
        choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')],
        default='unpaid'
    )
    payment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'companies_payment'
        verbose_name = 'Company Payment'
        verbose_name_plural = 'Company Payments'

    def __str__(self):
        return f"Payment {self.payment_id} - {self.company.product_name} - {self.amount}" 

class CustomUserKYC(models.Model):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE)
    user = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE)
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
    business_name = models.TextField(null=True, blank=True)
    business_registration_number = models.TextField(null=True, blank=True)
    entity_type = models.TextField(null=True, blank=True)
    source_of_funds = models.TextField()
    declaration = models.TextField(choices=[('agree', 'agree'), ('disagree', 'disagree')])
    signature_path = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'authentication_customuser_kyc'
        verbose_name = 'User KYC'
        verbose_name_plural = 'User KYCs'

    def __str__(self):
        return f"{self.user.email} - {self.company.product_name}" 