from django import urls
from django.urls import path
from . import views

urlpatterns = [
    path('api/register', views.register, name="register"),
    path('api/schedule', views.schedule, name="schedule"),
    path('api/available_jobs', views.available_jobs, name="available_jobs"),
    path('api/my_schedules', views.my_schedules, name="my_schedules"),
    path('api/accept_job', views.accept_job, name="accept_job"),
    path('api/my_jobs', views.my_jobs, name="my_jobs"),
    path('api/all_users', views.all_users, name="all_users"),
]