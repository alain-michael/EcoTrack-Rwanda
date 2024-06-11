from django.db import models

class Achievement(models.Model):
    name = models.CharField(max_length=255)
    points = models.IntegerField()
    image = models.CharField(max_length=255)
    preceding = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    is_earned_once = models.BooleanField(default=False)
    frequency = models.IntegerField()
    type = models.CharField(max_length=20, choices=[('REGISTER', 'REGISTER'), ('SHARE', 'SHARE'), ('SCHEDULE', 'SCHEDULE')])

    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    achievement = models.ForeignKey('Achievement', on_delete=models.CASCADE)
    frequency = models.IntegerField()
    startDate = models.DateTimeField(auto_now_add=True)
    completedDate = models.DateTimeField(null=True, blank=True)
    lastActionDate = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"

class Logging(models.Model):
    user = models.ForeignKey('authentication.User', on_delete=models.CASCADE)
    earned = models.BooleanField(default=False)
    text = models.TextField()

    def __str__(self):
        return f"Log by {self.user.username} - {'Earned' if self.earned else 'Not Earned'}"