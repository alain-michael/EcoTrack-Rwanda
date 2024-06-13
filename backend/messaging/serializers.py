from rest_framework import serializers
from .models import Message, ChatRoom
from authentication.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ChatRoomSerializer(serializers.ModelSerializer):
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
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().content

    def get_latest_message_time(self, obj):
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().created
        
    def get_latest_message_receiver(self, obj):
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().receiver.email
    
    def get_latest_message_read(self, obj):
        if obj.messages.exists():
            return obj.messages.order_by('-created').first().read