from django.db import migrations


EVENT_FIELDS = {
    'user_id': 'INTEGER',
    'cover_image': 'varchar(100)',
    'location_link': 'TEXT',
    'categories': 'TEXT',
    'registration_form': 'TEXT',
    'privacy': 'TEXT',
    'start_at': 'datetime',
    'end_at': 'datetime',
    'registration_end': 'datetime',
}


def add_missing_event_fields(apps, schema_editor):
    connection = schema_editor.connection
    table_name = 'company_event'
    existing_columns = {
        column.name
        for column in connection.introspection.get_table_description(
            connection.cursor(), table_name
        )
    }
    has_legacy_date = 'date' in existing_columns
    needs_start_at = 'start_at' not in existing_columns

    with connection.cursor() as cursor:
        for column_name, column_type in EVENT_FIELDS.items():
            if column_name not in existing_columns:
                quoted_table = schema_editor.quote_name(table_name)
                quoted_column = schema_editor.quote_name(column_name)
                cursor.execute(
                    f'ALTER TABLE {quoted_table} ADD COLUMN {quoted_column} {column_type}'
                )

        # Map legacy event dates into the fields used by the current API.
        if has_legacy_date and needs_start_at:
            cursor.execute(
                'UPDATE company_event SET start_at = date WHERE start_at IS NULL'
            )
            cursor.execute(
                'UPDATE company_event SET end_at = date WHERE end_at IS NULL'
            )


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0004_create_companyevent_table'),
    ]

    operations = [
        migrations.RunPython(add_missing_event_fields,
                             migrations.RunPython.noop),
    ]
