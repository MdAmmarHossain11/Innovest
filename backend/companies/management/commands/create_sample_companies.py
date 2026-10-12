from django.core.management.base import BaseCommand
from companies.models import Company

class Command(BaseCommand):
    help = 'Creates sample companies for testing'

    def handle(self, *args, **kwargs):
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
            Company.objects.get_or_create(
                name=company_data['name'],
                defaults=company_data
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created company "{company_data["name"]}"')
            ) 