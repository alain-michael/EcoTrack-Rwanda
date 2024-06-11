from rest_framework import serializers
from .models import Achievement

class AchievementSerializer(serializers.ModelSerializer):
    preceding = serializers.PrimaryKeyRelatedField(queryset=Achievement.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Achievement
        fields = '__all__'