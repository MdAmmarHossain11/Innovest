from django.db import migrations


def create_table_if_missing(apps, schema_editor):
    event_model = apps.get_model('events', 'CompanyEvent')
    table_name = event_model._meta.db_table
    existing_tables = schema_editor.connection.introspection.table_names()
    if table_name not in existing_tables:
        schema_editor.create_model(event_model)


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0003_alter_companyevent_table'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='companyevent',
            options={'ordering': ['-start_at']},
        ),
        migrations.RunPython(create_table_if_missing,
                             migrations.RunPython.noop),
    ]
