from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authentication', '0001_initial'),
        ('companies', '0005_company_user_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUserKYC',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('email', models.TextField()),
                ('phone_number', models.TextField()),
                ('date_of_birth', models.TextField()),
                ('address', models.TextField()),
                ('city', models.TextField()),
                ('country', models.TextField()),
                ('id_type', models.TextField()),
                ('id_document_path', models.TextField()),
                ('address_proof_type', models.TextField()),
                ('address_proof_path', models.TextField()),
                ('business_name', models.TextField(blank=True, null=True)),
                ('business_registration_number',
                 models.TextField(blank=True, null=True)),
                ('entity_type', models.TextField(blank=True, null=True)),
                ('source_of_funds', models.TextField()),
                ('declaration', models.CharField(choices=[
                 ('agree', 'agree'), ('disagree', 'disagree')], max_length=9)),
                ('signature_path', models.TextField()),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='companies.company')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='authentication.customuser')),
            ],
            options={
                'db_table': 'authentication_customuser_kyc',
                'verbose_name': 'User KYC',
                'verbose_name_plural': 'User KYCs',
            },
        ),
    ]
