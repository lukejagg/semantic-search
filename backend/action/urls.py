from django.urls import path
from .views import get_search, get_autocomplete, post_click_link



urlpatterns = [
    path('search/<str:search_value>', get_search, name='post-search'),
    path('autocomplete/<str:search_value>', get_autocomplete, name='post-autocomplete'),
    path('link', post_click_link, name='post-click-link')
]