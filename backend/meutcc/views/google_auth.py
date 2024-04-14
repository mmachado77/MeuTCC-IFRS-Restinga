from rest_framework.views import APIView
from meutcc.services import GoogleAuthService
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import redirect
from meutcc import settings
from base64 import b64encode
import json 

class GoogleAuthView(APIView):
    googleAuthService = GoogleAuthService()

    def get(self, request):
        return self.googleAuthService.request_authorization(request)

class GoogleAuthCallbackView(APIView):
    googleAuthService = GoogleAuthService()

    def get(self, request):
        user_info = self.googleAuthService.request_callback(request)

        user = User.objects.filter(username=user_info['id']).first()

        encoded_data = b64encode(json.dumps(user_info).encode()).decode('utf-8')

        if user is None:
            user = User.objects.create_user(username=user_info['id'], email=user_info['email'], password=None)
            user.save()

        token, created = Token.objects.get_or_create(user=user)

        return redirect(settings.AUTH_FRONTEND_URL.format(token = token.key, data = str(encoded_data)))