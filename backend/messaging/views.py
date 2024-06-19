from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Max
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
        room.save()
    message = Message(room=room, sender=sender, receiver=receiver, content=data['content'])
    message.save()
    return Response({'message': 'Message sent successfully'}, status=200)

class MessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_room(request, chatroom_id):
    user = request.user
    room = ChatRoom.objects.select_related('user1', 'user2').filter(id=chatroom_id).first()

    if not room:
        return Response({'error': 'Chatroom not found'}, status=404)
    
    if room.user1 != user and room.user2 != user:
        return Response({'error': 'User not in chatroom'}, status=404)

    paginator = MessagePagination()
    messages_qs = room.messages.select_related('sender', 'receiver').order_by('-created')
    result_page = paginator.paginate_queryset(messages_qs, request)

    unread_message_ids = [message.id for message in result_page if message.receiver == user and not message.read]
    if unread_message_ids:
        Message.objects.filter(id__in=unread_message_ids).update(read=True)

    messages = MessageSerializer(result_page[::-1], many=True).data
    room_data = ChatRoomSerializer(room).data

    return paginator.get_paginated_response({'messages': messages, 'room': room_data})


# @api_view(['GET', 'OPTIONS'])
# @permission_classes([IsAuthenticated])
# def get_room(request, chatroom_id):
#     room = ChatRoom.objects.select_related('user1', 'user2').filter(id=chatroom_id).first()
#     if not room:
#         return Response({'error': 'Chatroom not found'}, status=404)

#     user = request.user
#     if room.user1 != user and room.user2 != user:
#         return Response({'error': 'User not in chatroom'}, status=404)
#     other_user = room.user1 if room.user1 != user else room.user2
#     page = int(request.GET.get('page', 1))
#     if not user or not other_user:
#         return Response({'error': 'User not found'}, status=404)
#     messages = room.messages.all().order_by('created')[(page-1)*20:page*20]
#     for message in messages:
#         if message.receiver == user:
#             message.read = True
#             message.save()
#     return Response({'messages': MessageSerializer(messages, many=True).data, 'room': ChatRoomSerializer(room).data})

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def rooms(request):
    user = request.user
    rooms = ChatRoom.objects.filter(Q(user1=user) | Q(user2=user)).annotate(
        latest_message_time=Max('messages__created')
    ).order_by('-latest_message_time')
    return Response(ChatRoomSerializer(rooms, many=True).data)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def create_room(request):
    user = request.user
    print(request.data)
    if request.data['user_role'] == 'Admin':
        other_user = User.objects.filter(user_role='admin')
    else:
        if 'email' not in request.data:
            return Response({'error': 'Recipient email not provided'}, status=400)
        if request.data['email'] == user.email:
            return Response({'error': 'Cannot send messages to yourself'}, status=400)
        other_user = User.objects.filter(email=request.data['email'])
    if not other_user or not user:
        return Response({'error': 'User not found'}, status=404)
    else:
        other_user = other_user[0]
    query1 = Q(user1=user, user2=other_user)
    query2 = Q(user1=other_user, user2=user)
    room = ChatRoom.objects.filter(query1 | query2).first()
    if room:
        return Response({'error': 'Chat already exists'}, status=409)
    else:
        room = ChatRoom(user1=user, user2=other_user)
        room.save()
        return Response({'message': 'Chat created successfully', 'chatroom_id': room.id}, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_messages(request, chatroom_id):
    user = request.user
    if not user:
        return Response({'error': 'User not found'}, status=404)
    messages = Message.objects.filter(room__id=chatroom_id).order_by('-created')
    return Response(MessageSerializer(messages, many=True).data)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    user = request.user
    if not user:
        return Response({'error': 'User not found'}, status=404)
    if request.GET.get('type') == 'count':
        return Response({'notifications_count': user.notifications.filter(seen=False).count()}, status=200)
    notifications = Notification.objects.filter(user=user, seen=False).order_by('-created')
    data = NotificationSerializer(notifications, many=True).data
    notifications.update(seen=True)
    return Response({'notifications': data, 'notifications_count': len(data)}, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_unread_count(request):
    user = request.user
    if not user:
        return Response({'error': 'User not found'}, status=404)
    unread_count = Message.objects.filter(receiver=user, read=False).count()
    return Response(unread_count, status=200)
