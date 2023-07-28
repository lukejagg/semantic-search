from django.urls import path
from action import views



urlpatterns = [
    path('', views.post_action, name='post-action')
]