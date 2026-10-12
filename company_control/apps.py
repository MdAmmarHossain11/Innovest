from django.apps import AppConfig


class CompanyControlConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'company_control'

    def ready(self):
        from . import signals  # noqa: F401
