from django.urls import path
from . import views

urlpatterns = [
    path('api/messages/send', views.send, name="send_message"),
    path('api/messages', views.messages, name="messages"),
]