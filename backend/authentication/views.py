from django.shortcuts import render
from rest_framework import viewsets
from datetime import datetime
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import *
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

def add_cors_headers(response):
    response.headers = {
        'Access-Control-Allow-Origin': 'http://localhost',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': 'true'}
    return response

# Create your views here.
@api_view(['POST', 'OPTIONS'])
def register(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    if request.method == 'POST':
        user_data = request.data
        if 'name' not in user_data or 'email' not in user_data or 'password' not in user_data:
            return Response({'error': 'Missing required fields'}, status=400)
        
        user = User.objects.filter(email=user_data['email']).first()
        if user:
            return Response({'error': 'User already exists'}, status=409)
        
        if not user_data.get('userRole'):
            user_data['userRole'] = UserRoleChoices.house_user

        names = user_data['name'].split(' ')
        
        new_user = User(
            first_name=' '.join(names[:-1]),
            last_name=names[-1],
            email=user_data['email'],
            user_role=user_data['userRole']
        )
        new_user.set_password(user_data['password'])

        new_user.save()
        return Response({'message': 'User registered successfully', 'status': 201}, status=201)
    
@api_view(['POST', 'OPTIONS'])
def login(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
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
        }
    })

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def schedule(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    schedule_data = request.data
    user = request.user

    if not user:
        return Response({'error': 'User not found'}, status=404)

    address = None
    print(user.household_user_set)
    if user.household_user and user.household_user[0].addresses:
        address = user.household_user[0].addresses[0].address

    if not address:
        return Response({'error': 'Address not found'}, status=404)

    schedule = ColSchedule(
        user_id=user.id,
        date=datetime.strptime(schedule_data['date'], '%Y-%m-%dT%H:%M:%S.%fZ'),
        address=address,
        status=False,
    )
    schedule.save()
    return Response({'message': 'Schedule created successfully', 'status': 201}, status=201)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def my_schedules(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    user = request.user
    schedules = ColSchedule.objects.filter(user_id=user.id)
    return Response([{
        'id': schedule.id,
        'date': schedule.date,
        'address': schedule.address,
        'status': schedule.status
    } for schedule in schedules], status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def available_jobs(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    schedules = ColSchedule.objects.filter(status=False)
    return Response([{
        'id': schedule.id,
        'date': schedule.date,
        'address': schedule.address,
        'status': schedule.status
    } for schedule in schedules], status=200)

@api_view(['POST', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def accept_job(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    schedule_id = request.data['id']
    schedule = ColSchedule.objects.get(id=schedule_id)
    if not schedule:
        return Response({'error': 'Schedule not found'}, status=404)
    
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    schedule.collector = user
    schedule.status = True
    schedule.save()
    return Response({'message': 'Job accepted successfully'}, status=200)

@api_view(['Get', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def my_jobs(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    schedules = ColSchedule.objects.filter(collector=user)
    return Response([{
        'id': schedule.id,
        'date': schedule.date,
        'address': schedule.address,
        'status': schedule.status
    } for schedule in schedules], status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def all_users(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    if not request.user.is_staff:
        return Response({'error': 'User is not an admin'}, status=403)
    
    users = User.objects.all()
    return Response([{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'user_role': user.user_role
    } for user in users], status=200)