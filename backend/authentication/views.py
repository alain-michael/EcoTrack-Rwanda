import json
from django.shortcuts import render
from rest_framework import viewsets
from datetime import datetime, timedelta
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import git
import os

from achievements.models import Achievement
from achievements.serializers import AchievementSerializer
from .models import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from rest_framework import status
from achievements.utils import save_achievement

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Create your views here.
@api_view(['POST', 'OPTIONS'])
@authentication_classes([])
def register(request):
    if request.method == 'POST':
        user_data = request.data.copy()
        if 'name' not in user_data or 'email' not in user_data or 'password' not in user_data:
            return Response({'error': 'Missing required fields'}, status=400)
        
        user = User.objects.filter(email=user_data['email']).first()
        if user:
            return Response({'error': 'User already exists.'}, status=409)
        
        if not user_data.get('userRole'):
            user_data['userRole'] = UserRoleChoices.house_user

        names = user_data['name'].split(' ')
        
        new_user = User(
            first_name=' '.join(names[:-1]),
            last_name=names[-1],
            email=user_data['email'],
            user_role=user_data['userRole'],
            phone_number=user_data.get('phoneNumber')
        )
        new_user.set_password(user_data['password'])

        # Check if sharecode exists and is 4 digits
        sharecode = user_data.get('sharecode')
        if sharecode:
            user_with_sharecode = User.objects.filter(sharecode=sharecode).first()
            if user_with_sharecode:
                # Log that a new user has joined using the share code
                log_text = f"{new_user.first_name} {new_user.last_name} has joined using your share code"
                Logging.objects.create(user=user_with_sharecode, earned=False, text=log_text)

                # Call save_achievement for the user with sharecode
                save_achievement(user_with_sharecode.id, 'SHARE', frequency=1)
            else:
                return Response({'error': 'Invalid sharecode'}, status=400)

        new_user.save()

        save_achievement(new_user.id, 'REGISTER', frequency=1)

        return Response({'message': 'User registered successfully', 'status': 201}, status=201)
    
@api_view(['POST', 'OPTIONS'])
def login(request):
    if request.method == 'POST':
        user_data = request.data
        if not all(k in user_data for k in ('email', 'password')):
            return Response({'error': 'Missing required fields'}, status=400)

        user = User.objects.filter(email=user_data['email']).first()
        if not user or not user.check_password(user_data['password']):
            return Response({'error': 'Invalid email or password'}, status=401)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': refresh,
            'access': str(refresh.access_token),
            'user': {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'user_role': user.user_role,
                'phone_number': user.phone_number,
                'sharecode': user.sharecode,
                'canShare': user.canShare,
                'totalPoints': user.totalPoints
            }
        })

@api_view(['POST', 'OPTIONS'])
def logout(request):
    refresh_token = request.data.get('refresh_token')

    if not refresh_token:
        return Response({'error': 'Refresh token is required.'}, status=400)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist() 
        return Response({'success': 'User successfully logged out.'}, status=200)
    except Exception as e:
        return Response({'error': 'Failed to logout user.'}, status=500)


@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def schedule(request, schedule_id=None):
    if request.method == 'POST':
        data = request.data.copy()
        if 'repeat' not in data:
            return Response({'error': 'Repeat is required'}, status=400)
        data['repeat'] = data['repeat'].capitalize()
        if data['repeat'] not in RepeatScheduleChoices:
            return Response({'error': 'Invalid repeat choice'}, status=400)
        serializer = ScheduleSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            schedule = serializer.save()
            save_achievement(request.user.id, 'SCHEDULE', frequency=1)
            date = datetime.datetime.strftime(data['date_time'], "%d-%m-%Y")
            notification = Notification(
                user=request.user,
                text=f"{request.user.first_name} {request.user.last_name} has scheduled a {data['repeat']} repeat waste collection to start on {date}."
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def my_schedules(request):
    if request.method == 'GET':
        if request.user.user_role == UserRoleChoices.house_user:
            schedules = ColSchedule.objects.filter(user=request.user)
            serializer = ScheduleSerializer(schedules, many=True)
        else:
            schedules = ColSchedule.objects.filter(collector=request.user)
            serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def available_jobs(request):
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector.'}, status=403)
    
    schedules = ColSchedule.objects.filter(status=False)
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)


@api_view(['POST', 'PATCH', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def manage_job(request):
    schedule_id = request.data['id']
    schedule = ColSchedule.objects.get(id=schedule_id)
    if not schedule:
        return Response({'error': 'Schedule not found.'}, status=404)
    
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    if request.method == 'POST':
        schedule.collector = user
        schedule.status = True
        schedule.save()
        notification = Notification(user=schedule.user, message=f'{user.first_name} {user.last_name} has accepted your collection request.')
        notification.save()
        return Response({'message': 'Job accepted successfully'}, status=200)

    if request.method == 'PATCH' and not schedule.completed and schedule.collector == request.user: 
        schedule.completed = True
        schedule.save()
        time_to_next = {RepeatScheduleChoices.weekly: timedelta(days=7), RepeatScheduleChoices.two_weeks: timedelta(days=14)}
        notification = Notification(user=schedule.user, message=f'{user.first_name} {user.last_name} has completed your collection request.')
        notification.save()
        if schedule.repeat != RepeatScheduleChoices.none:
            new_schedule = ColSchedule(
                user=schedule.user,
                repeat=schedule.repeat,
                date=schedule.date_time + time_to_next[schedule.repeat],
            )
            new_schedule.save()
            notification = Notification(user=schedule.user, message=f'New collection has been set to the {datetime.strftime(new_schedule.date_time, "%d-%m-%Y")}.')
            return Response({'message': 'Job marked as completed and new schedule created'}, status=200)
        return Response({'message': 'Job completed'}, status=200)
    else:
        return Response({'error': 'Invalid request'}, status=400)


@api_view(['Get', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def my_jobs(request):
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    schedules = ColSchedule.objects.filter(collector=user)
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def all_users(request):
    if not request.user.is_staff:
        return Response({'error': 'User is not an admin'}, status=403)
    
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_job(request, id):
    user = request.user
    
    schedule = ColSchedule.objects.filter(id=id)
    if not schedule:
        return Response({'error': 'Schedule not found.'}, status=404)
    return Response(ScheduleSerializer(schedule[0]).data, status=200)


@api_view(['DELETE', 'PATCH', 'GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def manage_all_users(request, id):
    if not request.user.is_staff:
        return Response({'error': 'User is not an admin'}, status=403)
    
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method == "PATCH":
        serializer = UserSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def all_schedules(request):
    user = request.user
    if user.user_role != UserRoleChoices.admin_user:
        return Response({'error': 'User is not an admin'}, status=403)
    
    schedules = ColSchedule.objects.all()
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_user(request, id):    
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    if not old_password or not new_password:
        return Response({'error': 'Old password and new password are required'}, status=400)
    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect'}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password changed successfully'}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request, id):
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if not user.sharecode:
        user.sharecode = generate_sharecode()
        user.save()

    serializer = UserDetailSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def achievement_data(request):
    user = request.user
    if user.user_role != UserRoleChoices.admin_user:
        return Response({'error': 'User is not an admin'}, status=403)
    
    achievements = Achievement.objects.all()
    response = []

    for achievement in achievements:
        num_of_users = achievement.userachievement_set.filter(completedDate__isnull=False).count()
        response.append({'id': achievement.id, 'name': achievement.name, 'num_of_users': num_of_users, 'type': achievement.type})

    return Response(response, status=200)

@csrf_exempt
def github_webhook(request):
    if request.method == 'POST':
        repo = git.Repo('/home/ecotrackrw/EcoTrack-Rwanda') 
        origin = repo.remotes.origin
        repo.create_head('main', origin.refs.main).set_tracking_branch(origin.refs.main).checkout()
        origin.pull()
        os.system('touch /var/www/ecotrackrw_pythonanywhere_com_wsgi.py')
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)
