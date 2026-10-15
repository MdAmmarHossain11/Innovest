from io import BytesIO
from tempfile import TemporaryDirectory

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

from companies.models import Company


class PublicCompanyImageTests(TestCase):
    def test_company_detail_is_public_and_cover_image_loads(self):
        image_bytes = BytesIO()
        Image.new('RGB', (8, 5), color='red').save(image_bytes, format='PNG')
        cover_image = SimpleUploadedFile(
            'cover.png',
            image_bytes.getvalue(),
            content_type='image/png',
        )

        with TemporaryDirectory() as media_root, override_settings(
            MEDIA_ROOT=media_root,
            DEBUG=False,
        ):
            company = Company.objects.create(
                product_name='Public company',
                quick_description='Company listing test',
                industry='Technology',
                city='Dhaka',
                state='Dhaka',
                country='Bangladesh',
                cover_image=cover_image,
            )
            response = APIClient().get(f'/api/companies/{company.pk}/')

            self.assertEqual(response.status_code, 200)
            self.assertIn('/media/company_covers/', response.data['cover_image'])
            cover_path = response.data['cover_image'].split('/media/', 1)[1]
            image_response = APIClient().get(f'/media/{cover_path}')
            image_response.close()

        self.assertEqual(image_response.status_code, 200)
        self.assertEqual(image_response['Content-Type'], 'image/png')
