from urllib.parse import quote

from django.conf import settings


def public_media_url(file, request=None):
    if not file:
        return None

    name = getattr(file, 'name', file)
    if not name:
        return None

    media_path = quote(str(name).lstrip('/'), safe='/')
    url = f'{settings.MEDIA_URL.rstrip("/")}/{media_path}'
    return request.build_absolute_uri(url) if request else url
