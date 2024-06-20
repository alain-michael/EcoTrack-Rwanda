from django.utils.timezone import make_aware, get_current_timezone
from django.contrib.auth import authenticate
import datetime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *
from achievements.models import UserAchievement, Logging

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for obtaining JWT tokens.

    Attributes:
        username_field (str): The field used for authentication (email).
    """
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        """
        Customize the token to include additional user information.

        Args:
            user (User): The user for whom the token is generated.

        Returns:
            token (Token): The customized JWT token.
        """
        token = super().get_token(user)

        token['email'] = user.email
        token['user_role'] = user.user_role
        
        token['is_active'] = user.is_active
        token['is_staff'] = user.is_staff

        token['full_name'] = f"{user.first_name} {user.last_name}"
        
        
        if user.user_role == UserRoleChoices.house_user:
            token['addresses'] = AddressSerializer(user.addresses.first(), many=False).data

        return token

    def validate(self, attrs):
        """
        Validate user credentials and authenticate the user.

        Args:
            attrs (dict): The attributes containing the email and password.

        Returns:
            attrs (dict): The validated attributes.
        """
        # Take email from the input data
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                              email=email, password=password)

            if not user:
                msg = 'Unable to authenticate with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "email" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user

        return super().validate(attrs)
    
class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for Address model.

    Meta:
        model (Address): The Address model.
        fields (list): The fields to include in the serialized data.
    """
    class Meta:
        model = Address
        fields = ['longitude', 'latitude']

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.

    Meta:
        model (User): The User model.
        fields (list): The fields to include in the serialized data.
    """
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'email', 'user_role', 'created_at']

class ScheduleSerializer(serializers.ModelSerializer):
    """
    Serializer for ColSchedule model.

    Attributes:
        date (DateTimeField): The formatted date field.
        address (AddressSerializer): The nested address serializer.
        longitude (SerializerMethodField): The longitude field derived from address.
        latitude (SerializerMethodField): The latitude field derived from address.
        user (UserSerializer): The nested user serializer.
        collector (UserSerializer): The nested collector serializer.
        collector_name (SerializerMethodField): The collector name derived from collector.
    
    Meta:
        model (ColSchedule): The ColSchedule model.
        fields (list): The fields to include in the serialized data.
        read_only_fields (list): The fields that are read-only.
    """
    date = serializers.DateTimeField(source='date_time', format='%Y-%m-%dT%H:%M:%S.%fZ')
    address = AddressSerializer(write_only=True)
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    collector = UserSerializer(read_only=True)
    collector_name = serializers.SerializerMethodField()

    class Meta:
        model = ColSchedule
        fields = ['id', 'date', 'status', 'address', 'repeat', 'collector', 'longitude', 'latitude', 'user', 'completed', 'collector_name']
        read_only_fields = ['id', 'status', 'collector', 'completed', 'collector_name']

    def get_longitude(self, obj):
        return obj.address.longitude if obj.address else None

    def get_latitude(self, obj):
        return obj.address.latitude if obj.address else None
    
    def get_collector_name(self, obj):
        return obj.collector.first_name + ' ' + obj.collector.last_name if obj.collector else None

    def validate_date(self, value):
        if value < datetime.datetime.now(get_current_timezone()):
            raise serializers.ValidationError('Date cannot be in the past')
        if not value.tzinfo:
            utc = datetime.timezone.utc
            return make_aware(value, timezone=utc)
        return value

    def validate(self, data):
        user = self.context['request'].user
        if not user:
            raise serializers.ValidationError('User not found')

        if 'address' not in data:
            if user.user_role == UserRoleChoices.house_user and user.addresses.exists():
                data['address'] = AddressSerializer(user.addresses.first()).data
            else:
                raise serializers.ValidationError('Address not provided and no default address found')

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        date_time = validated_data.pop('date_time')

        # Extract address data and create address instance
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)

        # Create schedule instance with the created address
        schedule = ColSchedule(
            user=user,
            date_time=date_time,
            status=False,
            address=address,
            **validated_data
        )
        schedule.save()
        return schedule

class UserAchievementSerializer(serializers.ModelSerializer):
    """
    Serializer for UserAchievement model.

    Attributes:
        achievement_name (CharField): The name of the achievement.
        achievement_img (CharField): The image URL of the achievement.
        achievement_frequency (CharField): The frequency required for the achievement.
    
    Meta:
        model (UserAchievement): The UserAchievement model.
        fields (list): The fields to include in the serialized data.
    """

    achievement_name = serializers.CharField(source='achievement.name')
    achievement_img = serializers.CharField(source='achievement.image')
    achievement_frequency = serializers.CharField(source='achievement.frequency')

    class Meta:
        model = UserAchievement
        fields = ['achievement_name', 'achievement_img', 'achievement_frequency', 'frequency', 'startDate', 'completedDate', 'lastActionDate']

class LoggingSerializer(serializers.ModelSerializer):
    """
    Serializer for Logging model.

    Meta:
        model (Logging): The Logging model.
        fields (list): The fields to include in the serialized data.
    """
    class Meta:
        model = Logging
        fields = ['text', 'earned', 'date']

class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed user information including achievements and logs.

    Attributes:
        achievements (SerializerMethodField): The user's achievements.
        logs (SerializerMethodField): The user's logs.
    
    Meta:
        model (User): The User model.
        fields (list): The fields to include in the serialized data.
    """
    achievements = serializers.SerializerMethodField()
    logs = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'user_role', 'sharecode', 'totalPoints', 'canShare', 'achievements', 'logs']

    def get_achievements(self, obj):
        achievements = UserAchievement.objects.filter(user=obj).order_by('-startDate')
        return UserAchievementSerializer(achievements, many=True).data

    def get_logs(self, obj):
        logs = Logging.objects.filter(user=obj).order_by('-date')
        return LoggingSerializer(logs, many=True).data
