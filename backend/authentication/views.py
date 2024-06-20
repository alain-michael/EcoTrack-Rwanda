import json
import subprocess
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
from ecotrack import settings
import git
import os
import logging
from threading import Thread

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
    """
    Register a new user.

    Args:
        request (Request): The request object containing user data.

    Returns:
        Response: A response object with success or error message.
    """
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
    """
    Log in a user and provide JWT tokens.

    Args:
        request (Request): The request object containing user credentials.

    Returns:
        Response: A response object with JWT tokens and user info, or an error message.
    """    
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
    """
    Log out a user by blacklisting their refresh token.

    Args:
        request (Request): The request object containing the refresh token.

    Returns:
        Response: A response object with success or error message.
    """
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
    """
    Schedule a new waste collection.

    Args:
        request (Request): The request object containing schedule data.
        schedule_id (int, optional): The ID of the schedule to update. Defaults to None.

    Returns:
        Response: A response object with schedule data or an error message.
    """
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
            notification = Notification(
                user=request.user,
                message=f"{request.user.first_name} {request.user.last_name} has scheduled a {data['repeat']} repeat waste collection."
            )
            notification.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def my_schedules(request):
    """
    Retrieve the schedules of the logged-in user.

    Args:
        request (Request): The request object.

    Returns:
        Response: A response object with the user's schedules.
    """
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
    """
    Retrieve available jobs for a waste collector.

    Args:
        request (Request): The request object.

    Returns:
        Response: A response object with available jobs or an error message.
    """
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector.'}, status=403)
    
    schedules = ColSchedule.objects.filter(status=False)
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)


@api_view(['POST', 'PATCH', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def manage_job(request):
    """
    Accept or mark a job as completed.

    Args:
        request (Request): The request object containing job data.

    Returns:
        Response: A response object with success or error message.
    """
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
    """
    Retrieve jobs assigned to the authenticated waste collector user.

    Returns a list of ongoing job schedules serialized as JSON.
    """
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    schedules = ColSchedule.objects.filter(collector=user,completed = False)
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def all_users(request):
    """
    Retrieve all users if the authenticated user is an admin.

    Returns a list of users serialized as JSON.
    """
    if not request.user.is_staff:
        return Response({'error': 'User is not an admin'}, status=403)
    
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_job(request, id):
    """
    Retrieve details of a specific job schedule by its ID.

    Returns the job schedule details serialized as JSON.
    """
    user = request.user
    
    schedule = ColSchedule.objects.filter(id=id)
    if not schedule:
        return Response({'error': 'Schedule not found.'}, status=404)
    return Response(ScheduleSerializer(schedule[0]).data, status=200)


@api_view(['DELETE', 'PATCH', 'GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def manage_all_users(request, id):
    """
    Perform operations (GET, PATCH, DELETE) on a specific user by ID,
    if the authenticated user is an admin.

    Returns user details on GET, updates user details on PATCH, and deletes
    the user on DELETE. Returns appropriate HTTP status codes for each operation.
    """
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
    """
    Retrieve all job schedules if the authenticated user is an admin.

    Returns a list of all job schedules serialized as JSON.
    """
    user = request.user
    if user.user_role != UserRoleChoices.admin_user:
        return Response({'error': 'User is not an admin'}, status=403)
    
    schedules = ColSchedule.objects.all()
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def get_user(request, id):   
    """
    Retrieve details of a specific user by their ID.

    Returns the user details serialized as JSON.
    """ 
    try:
        user = User.objects.get(pk=id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change the password for the authenticated user.

    Accepts old_password and new_password in the request data.
    Returns a success message upon successful password change.
    """
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
    """
    Retrieve detailed information about a specific user by ID.

    Generates and assigns a share code to the user if it doesn't exist.
    Returns the detailed user information serialized as JSON.
    """
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
    """
    Retrieve data about achievements, including the number of users
    who have completed each achievement, if the authenticated user is an admin.

    Returns achievement data serialized as JSON.
    """
    user = request.user
    if user.user_role != UserRoleChoices.admin_user:
        return Response({'error': 'User is not an admin'}, status=403)
    
    achievements = Achievement.objects.all()
    response = []

    for achievement in achievements:
        num_of_users = achievement.userachievement_set.filter(completedDate__isnull=False).count()
        response.append({'id': achievement.id, 'name': achievement.name, 'num_of_users': num_of_users, 'type': achievement.type})

    return Response(response, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def completed_user_schedules(request):
    """
    Retrieve completed job schedules for the authenticated user.

    Returns a list of completed job schedules serialized as JSON.
    """
    user = request.user
    schedules = ColSchedule.objects.filter(user=user, completed=True)

    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def completed_jobs(request):
    """
    Retrieve completed job schedules assigned to the authenticated waste collector user.

    Returns a list of completed job schedules serialized as JSON.
    """
    user = request.user
    schedules = ColSchedule.objects.filter(collector=user, completed=True)

    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET'])
@authentication_classes([])

def count_stats(request):
    """
    Retrieve counts of total users, waste collectors, and job schedules.

    Returns counts as JSON data.
    """
    try:
        total_users = User.objects.count()
        total_collectors = User.objects.filter(user_role=UserRoleChoices.waste_collector).count()
        total_schedules = ColSchedule.objects.count()

        return Response({
            'total_users': total_users,
            'total_collectors': total_collectors,
            'total_schedules': total_schedules
        }, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def github_webhook(request):
    """
    Handle GitHub webhook events for repository updates.

    Automatically pulls updates from the main branch of the specified repository
    and triggers background tasks including dependency installation, testing,
    migrations, and WSGI application reload.

    Returns HTTP responses based on webhook event outcomes.
    """
    if request.method == 'POST':
        repo_path = '/home/ecotrackrw/EcoTrack-Rwanda'
        try:
            repo = git.Repo(repo_path)
        except git.exc.NoSuchPathError:
            logging.error(f'No such path: {repo_path}')
            return HttpResponse('Invalid repository path', status=400)
        except git.exc.InvalidGitRepositoryError:
            logging.error(f'Invalid Git repository: {repo_path}')
            return HttpResponse('Invalid Git repository', status=400)
        origin = repo.remotes.origin
        try:
            origin.fetch()
            # Checkout the 'main' branch and pull the latest changes
            if 'main' in repo.heads:
                repo.heads['main'].checkout()
            else:
                repo.create_head('main', origin.refs.main).set_tracking_branch(origin.refs.main).checkout()
            origin.pull()
        except git.exc.GitCommandError as e:
            logging.error(f'Git command error: {e}')
            return HttpResponse('Error during git operations', status=500)
    
        Thread(target=background_tasks).start()
        return HttpResponse('Webhook received', status=200)
    else:
        return HttpResponse(status=400)

def background_tasks():
    """
    Perform background tasks triggered by GitHub webhook events.

    Tasks include installing dependencies, running tests, executing migrations,
    and reloading the WSGI application.

    Logs errors encountered during these tasks.
    """
    # Install dependencies
    repo_path = '/home/ecotrackrw/EcoTrack-Rwanda/backend'
    try:
        requirements_file = os.path.join(repo_path, 'requirements.txt')
        subprocess.check_call(['pip', 'install', '-r', requirements_file])
    except subprocess.CalledProcessError as e:
        logging.error(f'Error installing dependencies: {e}')

    # Run tests
    try:
        manage_py = os.path.join(repo_path, 'manage.py')
        subprocess.check_call(['python', manage_py, 'test'])
    except subprocess.CalledProcessError as e:
        logging.error(f'Test execution failed: {e}')

    try:
        manage_py = os.path.join(repo_path, 'manage.py')
        subprocess.check_call(['python', manage_py, 'makemigrations'])
        subprocess.check_call(['python', manage_py, 'migrate'])
    except subprocess.CalledProcessError as e:
        logging.error(f'Migration execution failed: {e}')

    # Reload the WSGI application
    try:
        os.system('touch /var/www/ecotrackrw_pythonanywhere_com_wsgi.py')
    except OSError as e:
        logging.error(f'Error reloading WSGI application: {e}')
