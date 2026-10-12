from django.core.management.base import BaseCommand
from ml_api.predictor import predictor

class Command(BaseCommand):
    help = 'Retrain the XGBoost model with the latest data'

    def handle(self, *args, **options):
        self.stdout.write('Starting model retraining with XGBoost...')
        try:
            accuracy = predictor.train()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully retrained XGBoost model with accuracy: {accuracy:.2f}')
            )
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error retraining model: {str(e)}'))
