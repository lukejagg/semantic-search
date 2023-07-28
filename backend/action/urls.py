from django.urls import path
from .views import post_action



urlpatterns = [
    path('', post_action, name='post-action')
]