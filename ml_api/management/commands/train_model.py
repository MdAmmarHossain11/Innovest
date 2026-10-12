import os
import json
from django.core.management.base import BaseCommand
from django.conf import settings
from ml_api.predictor import predictor

class Command(BaseCommand):
    help = 'Train the startup profitability prediction model'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force training even if model exists',
        )

    def handle(self, *args, **options):
        try:
            # Check if model already exists
            model_path = os.path.join(settings.BASE_DIR, 'ml_api', 'startup_model.joblib')
            if os.path.exists(model_path) and not options['force']:
                self.stdout.write(self.style.WARNING(
                    'Model already exists. Use --force to retrain.'
                ))
                return

            self.stdout.write('Starting model training...')
            
            # Train the model
            accuracy = predictor.train()
            
            # Load model info
            model_info_path = os.path.join(settings.BASE_DIR, 'ml_api', 'model_info.json')
            with open(model_info_path, 'r') as f:
                model_info = json.load(f)
            
            self.stdout.write(self.style.SUCCESS('Model trained and saved successfully'))
            self.stdout.write(f"Test Accuracy: {model_info['test_accuracy']:.2%}")
            self.stdout.write(f"Training Samples: {model_info['samples_trained']}")
            self.stdout.write(f"Model saved to: {model_path}")
            
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error training model: {str(e)}'))
            
            # Print traceback for debugging
            import traceback
            self.stderr.write(traceback.format_exc())
            
            # Check for common issues
            if 'No module named' in str(e):
                self.stderr.write(self.style.WARNING(
                    '\nIt seems some Python packages are missing. '
                    'Make sure you have installed all required packages:\n'
                    'pip install scikit-learn pandas joblib numpy'
                ))
            elif 'No such file or directory' in str(e):
                self.stderr.write(self.style.WARNING(
                    '\nIt seems the data file is missing. '
                    'Make sure you have run migrations and have data in the database.'
                ))
