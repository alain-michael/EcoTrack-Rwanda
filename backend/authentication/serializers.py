from django.utils.timezone import make_aware, get_current_timezone
from django.contrib.auth import authenticate
import datetime
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
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
    class Meta:
        model = Address
        fields = ['longitude', 'latitude']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'user_role']

class ScheduleSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(source='date_time', format='%Y-%m-%dT%H:%M:%S.%fZ')
    address = AddressSerializer(write_only=True)
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = ColSchedule
        fields = ['id', 'date', 'status', 'address', 'repeat', 'collector', 'longitude', 'latitude', 'user']
        read_only_fields = ['id', 'status', 'collector']

    def get_longitude(self, obj):
        return obj.address.longitude if obj.address else None

    def get_latitude(self, obj):
        return obj.address.latitude if obj.address else None

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
