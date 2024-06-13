from django.urls import path
from . import views

urlpatterns = [
    path('api/messages/send', views.send, name="send_message"),
    path('api/rooms', views.rooms, name="rooms"),
    path('api/rooms/<int:chatroom_id>', views.get_room, name="get_room"),
    path('api/rooms/<int:chatroom_id>/messages', views.get_messages, name="get_room"),
    path('api/rooms/create', views.create_room, name="create_room"),
]