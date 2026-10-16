from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.storage import default_storage
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

from companies.models import Company


class PublicCompanyImageTests(TestCase):
    def test_profile_picture_upload_is_available_from_media_url(self):
        user = get_user_model().objects.create_user(
            email='profile@example.com',
            password='test-password',
            first_name='Profile',
            last_name='Owner',
        )
        image_bytes = BytesIO()
        Image.new('RGB', (8, 5), color='green').save(image_bytes, format='PNG')
        upload = SimpleUploadedFile(
            'profile.png',
            image_bytes.getvalue(),
            content_type='image/png',
        )

        with TemporaryDirectory() as media_root, override_settings(
            MEDIA_ROOT=media_root,
            DEBUG=False,
        ):
            client = APIClient()
            client.force_authenticate(user)
            response = client.patch(
                '/api/auth/profile/',
                {'profile_pic': upload},
                format='multipart',
            )

            self.assertEqual(response.status_code, 200, response.data)
            self.assertIn('/media/profile_pics/', response.data['profile_pic'])
            image_path = response.data['profile_pic'].split('/media/', 1)[1]
            image_response = client.get(f'/media/{image_path}')
            image_response.close()

        self.assertEqual(image_response.status_code, 200)
        self.assertEqual(image_response['Content-Type'], 'image/png')

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

    def test_generic_upload_uses_configured_storage_and_is_served(self):
        user = get_user_model().objects.create_user(
            email='uploader@example.com',
            password='test-password',
            first_name='Test',
            last_name='Uploader',
        )
        image_bytes = BytesIO()
        Image.new('RGB', (8, 5), color='blue').save(image_bytes, format='PNG')
        upload = SimpleUploadedFile(
            'slide.png',
            image_bytes.getvalue(),
            content_type='image/png',
        )

        with TemporaryDirectory() as media_root, override_settings(
            MEDIA_ROOT=media_root,
            DEBUG=False,
        ):
            client = APIClient()
            client.force_authenticate(user)
            response = client.post(
                '/api/upload-image/',
                {'image': upload, 'upload_to': 'company_slides'},
                format='multipart',
            )

            self.assertEqual(response.status_code, 200, response.data)
            self.assertTrue(default_storage.exists(
                f"company_slides/{response.data['filename']}"))
            image_response = client.get(response.data['url'])
            image_response.close()

        self.assertEqual(image_response.status_code, 200)
        self.assertEqual(image_response['Content-Type'], 'image/png')

    def test_generic_upload_rejects_unapproved_storage_directories(self):
        user = get_user_model().objects.create_user(
            email='uploader@example.com',
            password='test-password',
            first_name='Test',
            last_name='Uploader',
        )
        client = APIClient()
        client.force_authenticate(user)

        response = client.post(
            '/api/upload-image/',
            {
                'image': SimpleUploadedFile(
                    'anything.txt',
                    b'not an image',
                    content_type='text/plain',
                ),
                'upload_to': '../unexpected',
            },
            format='multipart',
        )

        self.assertEqual(response.status_code, 400)
