from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyAnalysis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startup_name', models.CharField(blank=True, max_length=255, null=True)),
                ('industry', models.CharField(max_length=100)),
                ('funding_rounds', models.CharField(blank=True, max_length=100, null=True)),
                ('funding_amount_m_usd', models.CharField(blank=True, max_length=100, null=True)),
                ('valuation_m_usd', models.CharField(blank=True, max_length=100, null=True)),
                ('revenue_m_usd', models.CharField(blank=True, max_length=100, null=True)),
                ('employees', models.CharField(blank=True, max_length=100, null=True)),
                ('market_share_percent', models.CharField(blank=True, max_length=100, null=True)),
                ('profitable', models.CharField(blank=True, max_length=10, null=True)),
                ('year_founded', models.CharField(blank=True, max_length=10, null=True)),
                ('region', models.CharField(blank=True, max_length=100, null=True)),
                ('exit_status', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('prediction', models.JSONField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='company_analyses', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Company Analyses',
                'ordering': ['-created_at'],
            },
        ),
    ]
