from django.db import models
from django.utils import timezone

class Achievement(models.Model):
    """
    Model representing an achievement.

    Attributes:
        name (str): The name of the achievement.
        points (int): The points awarded for the achievement.
        image (str): The URL or path to the image representing the achievement.
        preceding (ForeignKey): The preceding achievement that must be completed before this one.
        frequency (int): The frequency required to achieve this achievement.
        type (str): The type of achievement, can be 'REGISTER', 'SHARE', or 'SCHEDULE'.
    """
    name = models.CharField(max_length=255)
    points = models.IntegerField()
    image = models.CharField(max_length=255)
    preceding = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    frequency = models.IntegerField()
    type = models.CharField(max_length=20, choices=[('REGISTER', 'REGISTER'), ('SHARE', 'SHARE'), ('SCHEDULE', 'SCHEDULE')])

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    """
    Model representing a user's achievement.

    Attributes:
        user (ForeignKey): The user who achieved the achievement.
        achievement (ForeignKey): The achievement that was achieved.
        frequency (int): The frequency with which the achievement has been completed.
        startDate (DateTime): The date when the user started working towards the achievement.
        completedDate (DateTime): The date when the user completed the achievement.
        lastActionDate (DateTime): The date when the user last took action towards the achievement.
    """
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    achievement = models.ForeignKey('Achievement', on_delete=models.CASCADE)
    frequency = models.IntegerField()
    startDate = models.DateTimeField(auto_now_add=True)
    completedDate = models.DateTimeField(null=True, blank=True)
    lastActionDate = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.achievement.name}"

class Logging(models.Model):
    """
    Model representing a log entry.

    Attributes:
        user (ForeignKey): The user who created the log entry.
        earned (bool): Whether the user earned the achievement.
        text (str): The text description of the log entry.
        date (DateTime): The date and time when the log entry was created.
    """
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    earned = models.BooleanField(default=False)
    text = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Log by {self.user.first_name} {self.user.last_name} - {'Earned' if self.earned else 'Not Earned'}"