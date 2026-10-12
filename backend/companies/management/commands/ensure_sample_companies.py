from django.core.management.base import BaseCommand
from companies.models import Company

class Command(BaseCommand):
    help = 'Ensures sample companies exist in the database'

    def handle(self, *args, **kwargs):
        if Company.objects.count() == 0:
            companies = [
                {
                    'name': 'Tech Innovators',
                    'description': 'A cutting-edge technology company focused on AI and machine learning solutions.',
                    'industry': 'Technology',
                    'location': 'San Francisco, CA',
                    'privacy_status': 'public'
                },
                {
                    'name': 'Green Energy Solutions',
                    'description': 'Renewable energy company developing sustainable power solutions.',
                    'industry': 'Energy',
                    'location': 'Austin, TX',
                    'privacy_status': 'public'
                },
                {
                    'name': 'HealthTech Pro',
                    'description': 'Healthcare technology company revolutionizing patient care through digital solutions.',
                    'industry': 'Healthcare',
                    'location': 'Boston, MA',
                    'privacy_status': 'public'
                }
            ]

            for company_data in companies:
                Company.objects.create(**company_data)
                self.stdout.write(
                    self.style.SUCCESS(f'Created company "{company_data["name"]}"')
                )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Database already has {Company.objects.count()} companies')
            ) 