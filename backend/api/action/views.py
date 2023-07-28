from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from action.models import Action
from action.serializers import ActionSerializer


# CRUD logic
@api_view(['POST'])
def post_action(request):
    if request.method == 'POST':
        serializer = ActionSerializer(data = request.data)

        if serializer.is_valid():
            print(serializer.data)
            # serializer.save()

            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)
