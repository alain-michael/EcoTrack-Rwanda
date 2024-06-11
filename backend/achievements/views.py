from rest_framework import viewsets
from rest_framework import status, serializers
from rest_framework.response import Response
from .models import Achievement
from .serializers import AchievementSerializer
import cloudinary.uploader
from .utils import upload_to_cloudinary

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.select_related('preceding')
    serializer_class = AchievementSerializer

    def create(self, request, *args, **kwargs):
        achievement_type = request.data.get('type')
        if achievement_type == 'REGISTER':
            existing_achievement = Achievement.objects.filter(type='REGISTER').first()
            if existing_achievement:
                return Response({'error': 'An achievement for registering already exists.'}, status=status.HTTP_400_BAD_REQUEST)


            # Ensure frequency is 1 and preceding is null for REGISTER type
            request.data['frequency'] = 1
            request.data['preceding'] = None
            request.data['is_earned_once'] = True

        uploaded_file = request.FILES.get('image')
        image_url = request.data.get('image')

        if uploaded_file:
            try:
                image_url = upload_to_cloudinary(uploaded_file)
                request.data['image'] = image_url
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        elif not image_url:
            return Response({'error': 'Image is required'}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('image')
        instance = self.get_object()
        image_url = request.data.get('image')
        data = request.data.copy()

        if uploaded_file:
            try:
                image_url = upload_to_cloudinary(uploaded_file)
                data['image'] = image_url
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        elif not image_url:
            data['image'] = instance.image

        if instance.type == 'REGISTER':
            data['frequency'] = 1
            data['preceding'] = None
            data['is_earned_once'] = True

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def validate_register_achievement(self, data):
        if data['type'] == 'REGISTER':
            existing_achievement = Achievement.objects.filter(type='REGISTER').first()
            if existing_achievement:
                return Response({'error': 'An achievement for registering already exists.', 'data': existing_achievement}, status=status.HTTP_400_BAD_REQUEST)

            data['frequency'] = 1
            data['preceding'] = None
            data['is_earned_once'] = True

    def perform_create(self, serializer):
        self.validate_register_achievement(serializer.validated_data)
        serializer.save()

    def perform_update(self, serializer):
        self.validate_register_achievement(serializer.validated_data)
        serializer.save()