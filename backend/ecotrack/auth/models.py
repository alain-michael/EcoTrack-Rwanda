from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser

# Create your models here.
class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class UserRoleChoices(models.TextChoices):
    """
    Enum representing the roles of a user.

    Choices:
        admin (String): The name of the admin role.
        user (String): The name of the user role.
    """
    admin = "Admin"
    house_user = "Household User"

class User(AbstractUser):
    username = None
    USERNAME_FIELD = 'email'
    email = models.EmailField(_('email address'), unique=True)
    REQUIRED_FIELDS = []      # No additional required fields
    user_role = models.CharField(max_length=20, choices=UserRoleChoices, default=UserRoleChoices.house_user)

    objects = UserManager()

class Address(models.Model):
    """
    Model representing an Address.

    Attributes:
        id (Integer): The primary key and unique identifier of the address.
        household_user (Integer): Foreign key referencing the HouseholdUser.
        address (String): The actual address.
    """
    household_user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)

class RepeatScheduleChoices(models.TextChoices):
    """
    Enum representing the repeat schedules of a collection schedule.

    Choices:
        none (String): The name of the none repeat schedule.
        twice (String): The name of the twice repeat schedule.
        weekly (String): The name of the weekly repeat schedule.
        two_weeks (String): The name of the two_weeks repeat schedule.
    """
    none = "None"
    twice = "Twice a week"
    weekly = "Weekly"
    two_weeks = "Every 2 weeks"

class ColSchedule(models.Model):
    """
    Model representing a Collection Schedule.

    Attributes:
        id (Integer): The primary key and unique identifier of the collection schedule.
        user (Relationship): Foreign key referencing the User.
        collector (Relationship): Foreign key referencing the WasteCollector.
        date (DateTime): The date of the collection.
        address (String): The address for the collection.
        status (Boolean): The status of the collection (completed or not).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    collector = models.ForeignKey(user, on_delete=models.CASCADE, default=None)
    date_time = models.DateTimeField()
    address = models.CharField(max_length=255)
    status = models.BooleanField(default=False)
    repeat = models.CharField(max_length=255, choices=RepeatScheduleChoices.choices, default=RepeatScheduleChoices.none)

    def __str__(self): 
        return self.address