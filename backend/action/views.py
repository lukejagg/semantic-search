from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Action
from .serializers import ActionSerializer
from enum import Enum
from search.search import search, autocomplete

class ActionType(Enum):
    SEARCH = 'search'
    AUTOCOMPLETE = 'autocomplete'
    CLICK_LINK = 'click_link'

def handle_search(search):
    # Input search into Luke's ML model to get semantic responses
    text_response = ''
    # text_response = ml_model.input(search)

    return Response(text_response, status=200)

def handle_autocomplete(search):
    # Input search into Luke's ML model to get list of strings for autocomplete
    autocomplete_strings = ['']
    # autocomplete_strings = ml_model.input(search)

    return Response(autocomplete_strings, status=200)

def handle_click_link(link):
    # Input link into Luke's ML model for improvement
    # ml_model.input(link)

    return Response(status=200)

# CRUD logic
@api_view(['POST'])
def post_action(request):
    if request.method == 'POST':
        serializer = ActionSerializer(data = request.data)

        if serializer.is_valid():
            action = serializer.data
            
            if action['type'] == ActionType.SEARCH:
                return handle_search(action['body'])
            
            if action['type'] == ActionType.AUTOCOMPLETE:
                return handle_autocomplete(action['body'])
            
            if action['type'] == ActionType.CLICK_LINK:
                return handle_click_link(action['body'])            

            return Response(serializer.data, status=200)
        
        return Response(serializer.errors, status=400)
