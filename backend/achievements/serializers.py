from rest_framework import serializers
from .models import Achievement

class AchievementSerializer(serializers.ModelSerializer):
    """
    Serializer for the Achievement model.

    This serializer handles the conversion of Achievement instances
    to and from various data representations such as JSON. It also
    provides validation for the fields in the Achievement model.

    Attributes:
        preceding (PrimaryKeyRelatedField): A field for the preceding achievement,
            allowing null values and not required.
    """

    preceding = serializers.PrimaryKeyRelatedField(queryset=Achievement.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Achievement
        fields = '__all__'