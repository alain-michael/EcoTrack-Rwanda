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
