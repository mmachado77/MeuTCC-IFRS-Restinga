from django.conf import settings
from django.shortcuts import redirect
from django.views.generic.base import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

import requests


class GoogleAuthRedirect(View):
    permission_classes = [AllowAny]
    
    def get(self, request):
        scope = ' '.join(settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE)
        redirect_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY}&response_type=code&scope={scope}&access_type=offline&redirect_uri={settings.SOCIAL_AUTH_GOOGLE_REDIRECT_URI}"
        return redirect(redirect_url)


class GoogleRedirectURIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        code = request.GET.get('code')
        
        if code:
            token_endpoint = 'https://oauth2.googleapis.com/token'
            token_params = {
                'code': code,
                'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
                'redirect_uri': settings.SOCIAL_AUTH_GOOGLE_REDIRECT_URI,
                'grant_type': 'authorization_code',
            }
            
            response = requests.post(token_endpoint, data=token_params)

            print({ 'response': response })
            
            if response.status_code == 200:
                access_token = response.json().get('access_token')
                
                if access_token:
                    profile_endpoint = 'https://www.googleapis.com/oauth2/v1/userinfo'
                    headers = {'Authorization': f'Bearer {access_token}'}
                    profile_response = requests.get(profile_endpoint, headers=headers)
                    
                    if profile_response.status_code == 200:
                        data = {}
                        profile_data = profile_response.json()
                        user = User.objects.filter(username=profile_data["email"]).first()
                        if not user:
                            user = User.objects.create_user(username=profile_data["email"],
                                                                    email=profile_data["email"], password="12345678")
                        data['token'] = Token.objects.get_or_create(user=user)[0].key
                        return Response(data, status.HTTP_201_CREATED)
        
        return Response({}, status.HTTP_400_BAD_REQUEST)
