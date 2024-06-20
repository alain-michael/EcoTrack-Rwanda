from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import *
from authentication.models import *


class ChatAppTests(APITestCase):

    def setUp(self):
        """
        Set up test users and authenticate the client.

        Creates three users: user1, user2, and admin_user. Authenticates the client with user1.
        """
        self.client = APIClient()
        self.user1 = User.objects.create_user(email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(email='user2@example.com', password='password123')
        self.admin_user = User.objects.create_user(email='admin@example.com', password='password123', user_role='admin')
        self.client.force_authenticate(user=self.user1)

    def test_send_message(self):
        """
        Test sending a message from user1 to user2.

        Verifies that the message is sent successfully and the correct response is returned.
        """
        url = reverse('send_message')
        data = {
            'receiver': self.user2.id,
            'content': 'Hello, User2!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Message sent successfully')

    def test_send_message_no_receiver(self):
        """
        Test sending a message to a non-existent user.

        Verifies that the correct error response is returned when the receiver is not found.
        """
        url = reverse('send_message')
        data = {
            'receiver': 999,  # Non-existent user ID
            'content': 'Hello!'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Receiver not found')

    def test_get_room(self):
        """
        Test retrieving messages from a chat room.

        Creates a chat room and a message, then verifies that the messages and room data are retrieved correctly.
        """
        room = ChatRoom.objects.create(user1=self.user1, user2=self.user2)
        Message.objects.create(room=room, sender=self.user1, receiver=self.user2, content='Test Message')

        url = reverse('get_room', args=[room.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_get_room_not_found(self):
        """
        Test retrieving a non-existent chat room.

        Verifies that the correct error response is returned when the chat room is not found.
        """
        url = reverse('get_room', args=[999])  # Non-existent room ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Chatroom not found')

    def test_get_room_user_not_in_room(self):
        """
        Test retrieving a chat room where the authenticated user is not a participant.

        Verifies that the correct error response is returned when the user is not in the chat room.
        """
        room = ChatRoom.objects.create(user1=self.user2, user2=self.admin_user)
        url = reverse('get_room', args=[room.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'User not in chatroom')

    def test_rooms(self):
        """
        Test retrieving all chat rooms associated with the authenticated user.

        Creates a chat room and verifies that it is included in the response.
        """
        ChatRoom.objects.create(user1=self.user1, user2=self.user2)
        url = reverse('rooms')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_create_room(self):
        """
        Test creating a new chat room between user1 and user2.

        Verifies that the chat room is created successfully and the correct response is returned.
        """
        url = reverse('create_room')
        data = {
            'email': self.user2.email,
            'user_role': 'Waste Collector'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('chatroom_id', response.data)

    def test_create_room_already_exists(self):
        """
        Test creating a chat room that already exists.

        Creates a chat room, then verifies that the correct error response is returned when trying to create it again.
        """
        ChatRoom.objects.create(user1=self.user1, user2=self.user2)
        url = reverse('create_room')
        data = {
            'email': self.user2.email,
            'user_role': 'Waste Collector'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error'], 'Chat already exists')

    def test_create_room_self(self):
        """
        Test creating a chat room with the user themselves.

        Verifies that the correct error response is returned when trying to create a chat room with the same user.
        """
        url = reverse('create_room')
        data = {
            'email': self.user1.email,
            'user_role': 'Waste Collector'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Cannot send messages to yourself')

    def test_get_messages(self):
        """
        Test retrieving all messages from a specific chat room.

        Creates a chat room and a message, then verifies that the messages are retrieved correctly.
        """
        room = ChatRoom.objects.create(user1=self.user1, user2=self.user2)
        Message.objects.create(room=room, sender=self.user1, receiver=self.user2, content='Test Message')
        url = reverse('get_room_messages', args=[room.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) > 0)

    def test_get_notifications(self):
        """
        Test retrieving notifications for the authenticated user.

        Creates a notification and verifies that the notifications are retrieved correctly.
        """
        Notification.objects.create(user=self.user1, message='New notification')
        url = reverse('get_notifications')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('notifications' in response.data)
        self.assertTrue('notifications_count' in response.data)

    def test_get_unread_count(self):
        """
        Test retrieving the count of unread messages for the authenticated user.

        Creates an unread message and verifies that the unread count is retrieved correctly.
        """
        room = ChatRoom.objects.create(user1=self.user1, user2=self.user2)
        Message.objects.create(room=room, sender=self.user2, receiver=self.user1, content='Unread Message', read=False)
        url = reverse('get_unread_count')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, 1)
