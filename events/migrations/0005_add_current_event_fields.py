from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def copy_legacy_event_fields(apps, schema_editor):
    CompanyEvent = apps.get_model('events', 'CompanyEvent')
    events = CompanyEvent.objects.using(schema_editor.connection.alias)

    events.filter(start_at__isnull=True, date__isnull=False).update(
        start_at=models.F('date'))
    events.filter(end_at__isnull=True, date__isnull=False).update(
        end_at=models.F('date'))
    events.filter(cover_image__isnull=True).exclude(image='').update(
        cover_image=models.F('image'))


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0004_create_companyevent_table'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='companyevent',
            name='user',
            field=models.ForeignKey(
                blank=True, db_column='user_id', null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='cover_image',
            field=models.ImageField(
                blank=True, null=True, upload_to='event_images/'),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='location_link',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='categories',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='registration_form',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='privacy',
            field=models.TextField(default='publish'),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='start_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='end_at',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='companyevent',
            name='registration_end',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyevent',
            name='company',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='events', to='companies.company'),
        ),
        migrations.AlterField(
            model_name='companyevent',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyevent',
            name='id',
            field=models.AutoField(
                primary_key=True, serialize=False, db_column='id'),
        ),
        migrations.AlterField(
            model_name='companyevent',
            name='location',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='companyevent',
            name='title',
            field=models.TextField(),
        ),
        migrations.RunPython(copy_legacy_event_fields, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='companyevent',
            name='date',
        ),
        migrations.RemoveField(
            model_name='companyevent',
            name='image',
        ),
        migrations.AlterModelOptions(
            name='companyevent',
            options={'ordering': ['-start_at']},
        ),
    ]
