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
def schedule(request, schedule_id=None):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    if request.method == 'POST':
        serializer = ScheduleSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            schedule = serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def my_schedules(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
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
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    user = request.user
    if user.user_role != UserRoleChoices.waste_collector:
        return Response({'error': 'User is not a waste collector'}, status=403)
    
    schedules = ColSchedule.objects.filter(status=False)
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)


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
    return Response(ScheduleSerializer(schedules, many=True).data, status=200)

@api_view(['GET', 'OPTIONS'])
@permission_classes([IsAuthenticated])
def all_users(request):
    if request.method == 'OPTIONS':
        response = Response()
        return(add_cors_headers(response))
    
    if not request.user.is_staff:
        return Response({'error': 'User is not an admin'}, status=403)
    
    users = User.objects.all()
    return Response(UserSerializer(users, many=True).data, status=200)