from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Action
from .serializers import ActionSerializer
from enum import Enum
from search.search import search, autocomplete, log_click

class ActionType(Enum):
    SEARCH = 'search'
    AUTOCOMPLETE = 'autocomplete'
    CLICK_LINK = 'click_link'

def handle_search(search_value):
    # Input search into Luke's ML model to get semantic responses
    text_response = search(search_value)

    print(text_response)

    return Response(text_response, status=200)

def handle_autocomplete(search_value):
    # Input search into Luke's ML model to get list of strings for autocomplete
    autocomplete_strings = autocomplete(search_value)

    return Response(autocomplete_strings, status=200)

def handle_click_link(link):
    # Input link into Luke's ML model for improvement
    # ml_model.input(link)
    log_click(link)
    return Response(status=200)

# CRUD logic
@api_view(['GET'])
def get_search(request, search_value):
    if request.method == 'GET':
        return handle_search(search_value)


@api_view(['GET'])
def get_autocomplete(request, search_value):
    if request.method == 'GET':
        return handle_autocomplete(search_value)

@api_view(['POST'])
def post_click_link(request):
    if request.method == 'POST':
        serializer = ActionSerializer(data=request.data)
        if serializer.is_valid():
            action = serializer.data
            return handle_click_link(action['body'])
        return Response(serializer.errors, status=400)
