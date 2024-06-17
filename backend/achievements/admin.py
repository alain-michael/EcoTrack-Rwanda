from django.contrib import admin
from .models import Achievement
from .models import UserAchievement
from .models import Logging

# Register your models here.
admin.site.register([Achievement])
admin.site.register([UserAchievement])
admin.site.register([Logging])