from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view 

# Create your views here.
@api_view(['POST'])
def register(request):
    if request.method == 'OPTIONS':
        response = Response()
        response.headers.