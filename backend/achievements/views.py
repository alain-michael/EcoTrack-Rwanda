from rest_framework import viewsets
from rest_framework import status, serializers
from rest_framework.response import Response
from .models import Achievement
from .serializers import AchievementSerializer
import cloudinary.uploader
from .utils import upload_to_cloudinary

class AchievementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Achievement instances.

    This ViewSet provides actions to create, retrieve, update, and delete Achievements.
    It includes additional validation for 'REGISTER' type achievements to ensure
    only one such achievement exists and handles image uploads to Cloudinary.

    Attributes:
        queryset (QuerySet): The queryset to retrieve Achievement instances.
        serializer_class (Serializer): The serializer class for Achievement instances.
    """
    queryset = Achievement.objects.select_related('preceding')
    serializer_class = AchievementSerializer

    def create(self, request, *args, **kwargs):
        """
        Create a new Achievement instance.

        Validates that only one 'REGISTER' type achievement exists.
        Handles image upload to Cloudinary if an image file is provided.

        Args:
            request (Request): The request object containing the data for the new Achievement.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: The response containing the created Achievement or an error message.
        """

        achievement_type = request.data.get('type')
        if achievement_type == 'REGISTER':
            existing_achievement = Achievement.objects.filter(type='REGISTER').first()
            if existing_achievement:
                return Response({'error': 'An achievement for registering already exists.'}, status=status.HTTP_400_BAD_REQUEST)


            # Ensure frequency is 1 and preceding is null for REGISTER type
            request.data['frequency'] = 1
            request.data['preceding'] = None

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
        """
        Update an existing Achievement instance.

        Handles image upload to Cloudinary if an image file is provided.
        Ensures that 'REGISTER' type achievements have specific attributes.

        Args:
            request (Request): The request object containing the updated data for the Achievement.
            *args: Additional positional arguments.
            **kwargs: Additional keyword arguments.

        Returns:
            Response: The response containing the updated Achievement or an error message.
        """
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

        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def validate_register_achievement(self, data):
        """
        Validate 'REGISTER' type achievements.

        Ensures that only one 'REGISTER' type achievement exists and sets specific attributes.

        Args:
            data (dict): The data for the Achievement being validated.

        Returns:
            Response: An error response if a 'REGISTER' achievement already exists, otherwise None.
        """
        if data['type'] == 'REGISTER':
            existing_achievement = Achievement.objects.filter(type='REGISTER').first()
            if existing_achievement:
                return Response({'error': 'An achievement for registering already exists.', 'data': existing_achievement}, status=status.HTTP_400_BAD_REQUEST)

            data['frequency'] = 1
            data['preceding'] = None

    def perform_create(self, serializer):
        """
        Perform the create action for an Achievement.

        Validates 'REGISTER' type achievements and saves the new Achievement.

        Args:
            serializer (Serializer): The serializer containing the validated data for the new Achievement.
        """
        self.validate_register_achievement(serializer.validated_data)
        serializer.save()

    def perform_update(self, serializer):
        """
        Perform the update action for an Achievement.

        Validates 'REGISTER' type achievements and saves the updated Achievement.

        Args:
            serializer (Serializer): The serializer containing the validated data for the Achievement.
        """
        self.validate_register_achievement(serializer.validated_data)
        serializer.save()