from django.db import migrations


def rebuild_event_table(apps, schema_editor):
    connection = schema_editor.connection
    if connection.vendor != 'sqlite':
        return

    cursor = connection.cursor()
    columns = {
        column.name
        for column in connection.introspection.get_table_description(
            cursor, 'company_event'
        )
    }
    if 'company_id' not in columns or 'date' not in columns:
        return

    cursor.execute('''
        CREATE TABLE company_event_current (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES authentication_customuser(id),
            title TEXT NOT NULL,
            description TEXT NULL,
            cover_image varchar(100) NULL,
            location TEXT NULL,
            location_link TEXT NULL,
            categories TEXT NULL,
            registration_form TEXT NULL,
            privacy TEXT NOT NULL,
            start_at datetime NULL,
            end_at datetime NULL,
            registration_end datetime NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL
        )
    ''')
    cursor.execute('''
        INSERT INTO company_event_current (
            id, user_id, title, description, cover_image, location,
            location_link, categories, registration_form, privacy, start_at,
            end_at, registration_end, created_at, updated_at
        )
        SELECT
            id,
            COALESCE(user_id, (
                SELECT id FROM authentication_customuser
                ORDER BY is_superuser DESC, id LIMIT 1
            )),
            title,
            description,
            COALESCE(cover_image, image),
            location,
            location_link,
            categories,
            registration_form,
            COALESCE(NULLIF(privacy, ''), 'publish'),
            COALESCE(start_at, date),
            COALESCE(end_at, date),
            registration_end,
            created_at,
            updated_at
        FROM company_event
    ''')
    cursor.execute('DROP TABLE company_event')
    cursor.execute('ALTER TABLE company_event_current RENAME TO company_event')


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0005_add_current_event_fields'),
    ]

    operations = [
        migrations.RunPython(rebuild_event_table, migrations.RunPython.noop),
    ]
