from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('companies', '0004_companyfundraiseterms'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='user_id',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
