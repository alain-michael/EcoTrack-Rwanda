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


class ScheduleTestCase(TestCase):
    """Test cases for the schedule model."""
    def test_create_schedule(self):
        user = User.objects.create_user(email='test@example.com', password='password123')
        collector = User.objects.create_user(email='collector@example.com', password='password123')
        schedule = ColSchedule(user=user, date_time=tomorrow_datetime)
        self.assertEqual(schedule.user, user)
        self.assertEqual(schedule.collector, None)
        self.assertFalse(schedule.status)

    def test_create_schedule_with_collector(self):
        user = User.objects.create_user(email='test@example.com', password='password123')
        collector = User.objects.create_user(email='collector@example.com', password='password123')
        schedule = ColSchedule(user=user, date_time=tomorrow_datetime, collector=collector, status=True)
        self.assertEqual(schedule.user, user)
        self.assertEqual(schedule.collector, collector)
        self.assertEqual(schedule.status, 200)

class UserSerializerTests(TestCase):

    def test_user_serialization(self):
        user = User.objects.create_user(email='user@example.com', password='password123', user_role=UserRoleChoices.house_user)
        serializer = UserSerializer(user)
        self.assertEqual(serializer.data['email'], 'user@example.com')
        self.assertEqual(serializer.data['user_role'], UserRoleChoices.house_user)

    def test_schedule_serialization(self):
        collector = User.objects.create_user(email='collector@example.com', password='password123', user_role=UserRoleChoices.waste_collector)
        schedule = ColSchedule.objects.create(collector=collector, date_time=tomorrow_datetime, status=False)
        serializer = ScheduleSerializer(schedule)
        self.assertEqual(serializer.data['collector']['email'], 'collector@example.com')
        self.assertEqual(serializer.data['collection_date'], '2023-06-08')
        self.assertFalse(serializer.data['status'])

class ViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email='user@example.com', password='password123', user_role=UserRoleChoices.house_user)
        self.collector = User.objects.create_user(email='collector@example.com', password='password123', user_role=UserRoleChoices.waste_collector)
        self.admin = User.objects.create_user(email='admin@example.com', password='password123', user_role=UserRoleChoices.admin_user)
        self.address = Address.objects.create(latitude=1.0, longitude=2.0)
        self.schedule = ColSchedule.objects.create(user=self.user, address=self.address, collector=self.collector, date_time=datetime.datetime.now()+datetime.timedelta(days=1), status=False)

    def test_available_jobs(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.get('jobs/available-jobs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_accept_job(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.post('jobs/accept_job', {'id': self.schedule.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.schedule.refresh_from_db()
        self.assertTrue(self.schedule.status)
        self.assertEqual(self.schedule.collector, self.collector)

    def test_my_jobs(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.get('jobs/my-jobs')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_all_users(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/all_users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_job(self):
        self.client.force_authenticate(user=self.collector)
        response = self.client.get(f'jobs/{self.schedule.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_collector_user_access(self):
        self.client.force_authenticate(user=self.user)
        print(self.client)
        response = self.client.get('/jobs/available-jobs')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
