from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('industry', models.CharField(max_length=100)),
                ('location', models.CharField(max_length=255)),
                ('privacy_status', models.CharField(choices=[('public', 'Public'), ('private', 'Private')], default='private', max_length=50)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='company_logos/')),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='company_covers/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name_plural': 'Companies',
                'ordering': ['-created_at'],
            },
        ),
    ] 