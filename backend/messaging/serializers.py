from rest_framework import serializers
from .models import Message, ChatRoom
from authentication.models import *
from authentication.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Message model.
    
    Serializes all fields of the Message model.
    """
    class Meta:
        model = Message
        fields = '__all__'

class ChatRoomSerializer(serializers.ModelSerializer):
    """
    Serializer for the ChatRoom model.
    
    Serializes the ChatRoom model with additional fields:
    - user1: Serialized representation of user1 (read-only).
    - user2: Serialized representation of user2 (read-only).
    - latest_message: Content of the latest message in the chat room (read-only).
    - latest_message_time: Timestamp of the latest message in the chat room (read-only).
    - latest_message_receiver: Email address of the receiver of the latest message (read-only).
    - latest_message_read: Read status of the latest message in the chat room (read-only).
    """
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    latest_message = serializers.SerializerMethodField()
    latest_message_time = serializers.SerializerMethodField()
    latest_message_receiver = serializers.SerializerMethodField()
    latest_message_read = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user2', 'latest_message', 'latest_message_time', 'latest_message_receiver', 'latest_message_read']

    def get_latest_message(self, obj):
        """
        Retrieve the content of the latest message in the chat room.
        
        Returns:
            str: Content of the latest message if exists, None otherwise.
        """
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().content

    def get_latest_message_time(self, obj):
        """
        Retrieve the timestamp of the latest message in the chat room.
        
        Returns:
            datetime.datetime: Timestamp of the latest message if exists, None otherwise.
        """
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().created
        
    def get_latest_message_receiver(self, obj):
        """
        Retrieve the email address of the receiver of the latest message in the chat room.
        
        Returns:
            str: Email address of the receiver if exists, None otherwise.
        """
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().receiver.email
    
    def get_latest_message_read(self, obj):
        """
        Retrieve the read status of the latest message in the chat room.
        
        Returns:
            bool: Read status of the latest message if exists, None otherwise.
        """
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().read
        

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notification model.
    
    Serializes all fields of the Notification model.
    """
    class Meta:
        model = Notification
        fields = '__all__'