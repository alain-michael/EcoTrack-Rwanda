import random
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.utils.translation import gettext_lazy as _

def generate_sharecode():
    return ''.join([str(random.randint(0, 9)) for _ in range(4)])

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
        extra_fields.setdefault('sharecode', generate_sharecode())
        extra_fields.setdefault('totalPoints', 0)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('sharecode', generate_sharecode())
        extra_fields.setdefault('totalPoints', 0)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class UserRoleChoices(models.TextChoices):
    """
    Enum representing the roles of a user.

    Choices:
        waste_collector (String): The name of the Waste Collector role.
        house_user (String): The name of the Household User role.
        admin_user (String): The name of the Admin User role.
    """
    waste_collector = "Waste Collector"
    house_user = "Household User"
    admin_user = "admin"
    

class User(AbstractUser):
    """
    Model representing a User.

    Attributes:
        id (Integer): The primary key and unique identifier of the user.
        email (String): The email of the user.
        phone_number (String): The phone number of the user.
        first_name (String): The first name of the user.
        last_name (String): The last name of the user.
        password (String): The password of the user.
        user_role (String): The role of the user.
        sharecode (String): A code the user can share with others to get rewards.
        totalPoints (Integer): The total achievement points of the user.
        canShare (Boolean): Whether the user can share his sharecode or not.
        created_at (DateTime): The date and time when the user was created.
    """
    username = None
    USERNAME_FIELD = 'email'
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    REQUIRED_FIELDS = []      # No additional required fields
    user_role = models.CharField(max_length=20, choices=UserRoleChoices.choices, default=UserRoleChoices.house_user)
    sharecode = models.CharField(max_length=4, default=generate_sharecode)
    totalPoints = models.IntegerField(default=0)
    canShare = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        verbose_name=_('groups'),
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text=_('Specific permissions for this user.'),
        verbose_name=_('user permissions'),
    )


class Notification(models.Model):
    """
    Model representing a Notification.

    Attributes:
        id (Integer): The primary key and unique identifier of the notification.
        user (Relationship): Foreign key referencing the User.
        message (String): The message of the notification.
        seen (Boolean): The status of the notification (seen or not).
        created (DateTime): When the notification was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

class Address(models.Model):
    """
    Model representing an Address.

    Attributes:
        id (Integer): The primary key and unique identifier of the address.
        household_user (Integer): Foreign key referencing the HouseholdUser.
        latitude (Decimal): The latitude of the address.
        longitude (Decimal): The longitude of the address.
    """
    household_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses', default=None, null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)

class RepeatScheduleChoices(models.TextChoices):
    """
    Enum representing the repeat schedules of a collection schedule.

    Choices:
        none (String): The name of the none repeat schedule.
        twice (String): The name of the twice repeat schedule.
        weekly (String): The name of the weekly repeat schedule.
        biweekly (String): The name of the biweekly repeat schedule.
    """
    none = "None"
    weekly = "Weekly"
    biweekly = "Biweekly"

class ColSchedule(models.Model):
    """
    Model representing a Collection Schedule.

    Attributes:
        id (Integer): The primary key and unique identifier of the collection schedule.
        user (Relationship): Foreign key referencing the User.
        collector (Relationship): Foreign key referencing the WasteCollector.
        date_time (DateTime): The date and time of the collection.
        address (String): The address for the collection.
        status (Boolean): The status of the collection (if it has been accepted or not).
        repeat (String): The repeat schedule of the collection.
        completed (Boolean): The status of the collection (completed or not).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedule_user')
    collector = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedule_collector', default=None, null=True, blank=True)
    date_time = models.DateTimeField()
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='schedule_address')
    status = models.BooleanField(default=False)
    repeat = models.CharField(max_length=255, choices=RepeatScheduleChoices.choices, default=RepeatScheduleChoices.none)
    completed = models.BooleanField(default=False)

    def __str__(self): 
        return str(self.address)