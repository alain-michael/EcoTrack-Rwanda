from django.test import TestCase
from django.db.utils import IntegrityError
import datetime
from .models import *
from .views import *
from .serializers import *
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()
tomorrow_datetime = datetime.datetime.now(get_current_timezone())+datetime.timedelta(days=1)


# Create your tests here.
class UserTestCase(TestCase):
    """Test cases for the user model."""
    def test_create_user(self):
        user = User.objects.create_user(email='test@example.com', password='password123')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('password123'))
        with self.assertRaises(IntegrityError):
            User.objects.create_user(email='test@example.com', password='password123')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_user_role(self):
        user = User.objects.create_user(email='collector@example.com', password='password123', user_role=UserRoleChoices.waste_collector)
        self.assertEqual(user.user_role, UserRoleChoices.waste_collector)
        admin_user = User.objects.create_user(email='admin@example.com', password='password123', user_role=UserRoleChoices.admin_user)
        self.assertEqual(admin_user.user_role, UserRoleChoices.admin_user)
        house_user = User.objects.create_user(email='house@example.com', password='password123', user_role=UserRoleChoices.house_user)
        self.assertEqual(house_user.user_role, UserRoleChoices.house_user)
        
    def test_user_serialization(self):
        user = User.objects.create_user(email='user@example.com', password='password123', user_role=UserRoleChoices.house_user)
        serializer = UserSerializer(user)
        self.assertEqual(serializer.data['email'], 'user@example.com')
        self.assertEqual(serializer.data['user_role'], UserRoleChoices.house_user)


class ScheduleTestCase(TestCase):
    """Test cases for the schedule model."""

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='password123')
        self.collector = User.objects.create_user(email='collector@example.com', password='password123')
        self.address = Address.objects.create(latitude=1.0, longitude=2.0)
        self.schedule = ColSchedule.objects.create(user=self.user, date_time=tomorrow_datetime, address=self.address)

    def test_create_schedule(self):
        schedule = ColSchedule(user=self.user, date_time=tomorrow_datetime, address=self.address)
        self.assertEqual(schedule.user, self.user)
        self.assertEqual(schedule.collector, None)
        self.assertFalse(schedule.status)

    def test_create_schedule_with_collector(self):
        schedule = ColSchedule(user=self.user, date_time=tomorrow_datetime, collector=self.collector, status=True, address=self.address)
        self.assertEqual(schedule.user, self.user)
        self.assertEqual(schedule.collector, self.collector)
        self.assertTrue(schedule.status)

    def test_schedule_serialization(self):
        schedule = ColSchedule(user=self.user, date_time=tomorrow_datetime, collector=self.collector, status=True, address=self.address)
        serializer = ScheduleSerializer(schedule)
        self.assertEqual(serializer.data['collector']['email'], 'collector@example.com')
        self.assertEqual(serializer.data['date'], tomorrow_datetime.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        self.assertTrue(serializer.data['status'])

class ViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='user@example.com', password='password123', user_role=UserRoleChoices.house_user)
        self.collector = User.objects.create_user(email='collector@example.com', password='password123', user_role=UserRoleChoices.waste_collector)
        self.admin = User.objects.create_user(email='admin@example.com', password='password123', user_role=UserRoleChoices.admin_user, is_staff=True)
        self.address = Address.objects.create(latitude=1.0, longitude=2.0)
        self.schedule = ColSchedule.objects.create(user=self.user, address=self.address, collector=self.collector, date_time=tomorrow_datetime, status=False)

    def test_available_jobs(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.get('/api/jobs/available-jobs')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_accept_job(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.post('/api/jobs/manage-job', {'id': self.schedule.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.schedule.refresh_from_db()
        self.assertTrue(self.schedule.status)
        self.assertEqual(self.schedule.collector, self.collector)

    def test_my_jobs(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.get('/api/jobs/my-jobs')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_all_users(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/all-users')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_all_users_not_admin(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/all-users')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(user=self.collector)
        response = self.client.get('/api/all-users')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_job(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.get(f'/api/jobs/{self.schedule.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_collector_user_access(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/jobs/available-jobs')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
