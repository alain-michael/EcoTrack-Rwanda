from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import *
from authentication.models import *
from .serializers import *


# Create your views here.
@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def send(request):
    sender = request.user
    data = request.data
    receiver = User.objects.filter(id=data['receiver'])
    if not receiver:
        return Response({'error': 'Receiver not found'}, status=404)
    else:
        receiver = receiver[0]
    if not sender or not receiver:
        return Response({'error': 'Sender not found'}, status=404)
    query1 = Q(user1=sender, user2=receiver)
    query2 = Q(user1=receiver, user2=sender)
    room = ChatRoom.objects.filter(query1 | query2).first()
    if not room:
        room = ChatRoom(user1=receiver, user2=sender)
    message = Message(room=room, sender=sender, receiver=receiver, content=data['content'])
    room.save()
    message.save()
    notification = Notification(user=receiver, message=message)
    notification.save()
    return Response({'message': 'Message sent successfully'}, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def messages(request):
    room = ChatRoom.objects.select_related('user1', 'user2').filter(id=request.data['chatroom_id'])
    if not room:
        return Response({'error': 'Chatroom not found'}, status=404)
    else:
        room = room[0]

    user = request.user
    if room.user1 != user and room.user2 != user:
        return Response({'error': 'User not in chatroom'}, status=404)
    other_user = room.user1 if room.user1 != user else room.user2
    page = request.data['page']
    if not user or not other_user:
        return Response({'error': 'User not found'}, status=404)
    messages = room.messages.all().order_by('-created')[(page-1)*20:page*20]
    for message in messages:
        if message.receiver == user:
            message.read = True
            message.save()
    return Response(MessageSerializer(messages, many=True).data)