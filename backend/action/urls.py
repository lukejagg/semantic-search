from django.urls import path
from .views import post_search, post_autocomplete, post_click_link



urlpatterns = [
    path('search/<str:search_value>', post_search, name='post-search'),
    path('autocomplete/<str:search_value>', post_autocomplete, name='post-autocomplete'),
    path('link', post_click_link, name='post-click-link')
]