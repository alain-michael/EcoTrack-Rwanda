# tests.py
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Achievement, UserAchievement, Logging
from authentication.models import User
from .serializers import AchievementSerializer
from unittest.mock import patch

class AchievementModelTestCase(TestCase):
    """
    Test case for the Achievement model.

    This test case validates the creation and string representation of the Achievement model.
    """

    def setUp(self):
        self.achievement = Achievement.objects.create(
            name='Test Achievement',
            points=100,
            image='http://example.com/image.jpg',
            frequency=1,
            type='REGISTER'
        )

    def test_achievement_creation(self):
        """
        Test that an Achievement instance is created successfully.
        """
        self.assertEqual(Achievement.objects.count(), 1)
        self.assertEqual(str(self.achievement), 'Test Achievement')


class AchievementViewSetTestCase(TestCase):
    """
    Test case for the AchievementViewSet.

    This test case validates the create and update functionality of the AchievementViewSet.
    """

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='testuser@example.com', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.achievement_data = {
            'name': 'Test Achievement',
            'points': 100,
            'image': 'http://example.com/image.jpg',
            'frequency': 1,
            'type': 'REGISTER'
        }

    @patch('achievements.utils.upload_to_cloudinary')
    def test_create_achievement(self, mock_upload):
        """
        Test creating a new Achievement instance with valid data.
        """
        mock_upload.return_value = 'http://cloudinary.com/image.jpg'
        response = self.client.post('/api/achievements', self.achievement_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Achievement.objects.count(), 1)
        self.assertEqual(Achievement.objects.get().name, 'Test Achievement')

    def test_create_register_achievement_duplicate(self):
        """
        Test that creating a duplicate 'REGISTER' type Achievement is not allowed.
        """
        Achievement.objects.create(**self.achievement_data)
        response = self.client.post('/api/achievements', self.achievement_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'An achievement for registering already exists.')

    @patch('achievements.utils.upload_to_cloudinary')
    def test_update_achievement(self, mock_upload):
        """
        Test updating an existing Achievement instance with valid data.
        """
        achievement = Achievement.objects.create(**self.achievement_data)
        update_data = self.achievement_data.copy()
        update_data['name'] = 'Updated Achievement'
        mock_upload.return_value = 'http://cloudinary.com/updated_image.jpg'
        response = self.client.put(f'/api/achievements/{achievement.id}/', update_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        achievement.refresh_from_db()
        self.assertEqual(achievement.name, 'Updated Achievement')
        self.assertEqual(achievement.image, 'http://cloudinary.com/updated_image.jpg')


class AchievementSerializerTestCase(TestCase):
    """
    Test case for the AchievementSerializer.

    This test case validates the serialization and deserialization of the Achievement model.
    """

    def setUp(self):
        self.achievement_data = {
            'name': 'Test Achievement',
            'points': 100,
            'image': 'http://example.com/image.jpg',
            'frequency': 1,
            'type': 'REGISTER'
        }
        self.achievement = Achievement.objects.create(**self.achievement_data)

    def test_achievement_serialization(self):
        """
        Test that an Achievement instance is serialized correctly.
        """
        serializer = AchievementSerializer(self.achievement)
        self.assertEqual(serializer.data['name'], 'Test Achievement')
        self.assertEqual(serializer.data['points'], 100)

    def test_achievement_deserialization(self):
        """
        Test that data is deserialized into an Achievement instance correctly.
        """
        serializer = AchievementSerializer(data=self.achievement_data)
        self.assertTrue(serializer.is_valid())
        achievement = serializer.save()
        self.assertEqual(achievement.name, 'Test Achievement')
        self.assertEqual(achievement.points, 100)


class UserAchievementModelTestCase(TestCase):
    """
    Test case for the UserAchievement model.

    This test case validates the creation and string representation of the UserAchievement model.
    """

    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpass')
        self.achievement = Achievement.objects.create(
            name='Test Achievement',
            points=100,
            image='http://example.com/image.jpg',
            frequency=1,
            type='REGISTER'
        )
        self.user_achievement = UserAchievement.objects.create(
            user=self.user,
            achievement=self.achievement,
            frequency=1
        )

    def test_user_achievement_creation(self):
        """
        Test that a UserAchievement instance is created successfully.
        """
        self.assertEqual(UserAchievement.objects.count(), 1)
        self.assertEqual(str(self.user_achievement), f"{self.user.first_name} {self.user.last_name} - {self.achievement.name}")


class LoggingModelTestCase(TestCase):
    """
    Test case for the Logging model.

    This test case validates the creation and string representation of the Logging model.
    """

    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpass')
        self.log_entry = Logging.objects.create(
            user=self.user,
            earned=True,
            text='Test log entry'
        )

    def test_logging_creation(self):
        """
        Test that a Logging instance is created successfully.
        """
        self.assertEqual(Logging.objects.count(), 1)
        self.assertEqual(str(self.log_entry), f"Log by {self.user.first_name} {self.user.last_name} - {'Earned' if self.log_entry.earned else 'Not Earned'}")
