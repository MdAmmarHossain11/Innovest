from backend.models import CompanyContact
from django.db import models

# Use CompanyContact model from backend app
# Dummy field to force migration
dummy_field = models.BooleanField(default=False)

# Ensure the model uses the existing table name
CompanyContact._meta.db_table = 'company_contact'

class EmailConfig(models.Model):
    is_enabled = models.BooleanField(default=True)
    smtp_host = models.CharField(max_length=255, blank=True, null=True)
    smtp_port = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return f"Email Configuration {'Enabled' if self.is_enabled else 'Disabled'}"
