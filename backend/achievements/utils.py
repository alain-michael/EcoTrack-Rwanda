import cloudinary.uploader
import datetime
from django.utils import timezone
from django.db import transaction
from django.db.models import F
from .models import UserAchievement, Achievement, Logging
from authentication.models import User


def save_achievement(user_id, achievement_type, frequency=1):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return 'User does not exist.'

    # Select the achievement based on type and ensure the user hasn't completed it already
    achievement = Achievement.objects.filter(
        type=achievement_type
    ).exclude(
        id__in=UserAchievement.objects.filter(
            user=user, 
            completedDate__isnull=False
        ).values_list('achievement_id', flat=True)
    ).first()

    if not achievement:
        return 'No available achievement found.'

    # Check if user achievement record exists with completedDate as null
    user_achievement, created = UserAchievement.objects.get_or_create(
        user=user,
        achievement=achievement,
        completedDate__isnull=True,
        defaults={
            'startDate': timezone.now(),
            'lastActionDate': timezone.now(),
            'frequency': 0
        }
    )

    # Update the frequency and lastActionDate if record exists
    user_achievement.frequency = F('frequency') + frequency
    user_achievement.lastActionDate = timezone.now()
    user_achievement.save()

    # Reload the instance to reflect the updated frequency
    user_achievement.refresh_from_db()
        
    # Check if the achievement is completed
    if user_achievement.frequency >= achievement.frequency:
        user_achievement.completedDate = timezone.now()
        user_achievement.save()
        
        # Log the achievement
        Logging.objects.create(
            user=user,
            text=f"Congrats, you've earned a new achievement {achievement.name}",
            earned=True
        )

        # Update user's total points
        user.totalPoints = F('totalPoints') + achievement.points
        user.save()
        user.refresh_from_db()

        # Log the points addition
        Logging.objects.create(
            user=user,
            text=f"You've earned +{achievement.points} points",
            earned=True
        )

        # Check for new possible achievements
        new_achievements = Achievement.objects.filter(
            preceding=achievement
        ).exclude(
            id__in=UserAchievement.objects.filter(user=user).values_list('achievement_id', flat=True)
        )

        for new_achievement in new_achievements:
            UserAchievement.objects.create(
                user=user,
                achievement=new_achievement,
                startDate=timezone.now(),
                lastActionDate=timezone.now(),
                frequency=0
            )

            # Log the new achievement unlocking
            Logging.objects.create(
                user=user,
                text=f"You've unlocked a new achievement {new_achievement.name}",
                earned=False
            )
    
    return 'Achievement processing completed.'

def upload_to_cloudinary(file_to_upload):

    cloud_name = 'dxeepn9qa'
    api_key = '396133459978945'
    api_secret = 'lij0YD3ThmYd_dPkBwpfSAplWxk'
    
    try:
        result = cloudinary.uploader.upload(
            file_to_upload, 
            folder='eco-track',
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
        return result.get('secure_url')
    except Exception as e:
        # Log the error or handle it as needed
        print(e)
        return None
