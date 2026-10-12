from django.contrib import admin
from .models import CommunityPost, CommunityComment

# Register your models here.
admin.site.register(CommunityPost)
admin.site.register(CommunityComment)
