from django.db import models

# Create your models here.
class ChatRoom(models.Model):
    """
    Model representing a Chatroom between 2 users.

    Attributes:
        user1 (Relationship): One of the users.
        user2 (Relationship): Another user.
        created (DateTime): When the chatroom was created.
    """
    user1 = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='user2')
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user1} and {self.user2}'
    
    class Meta:
        unique_together = ('user1', 'user2')

class Message(models.Model):
    """
    Model representing a Message between 2 users.

    Attributes:
        room (Relationship): The chatroom.
        sender (Relationship): The sender.
        receiver (Relationship): The receiver.
        content (String): The content of the message.
        created (DateTime): When the message was created.
        read (Boolean): Whether the message was read yet.
    """
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey('authentication.User', on_delete=models.CASCADE, related_name='receiver')
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return self.content
    