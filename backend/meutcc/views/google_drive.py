from rest_framework.views import APIView
from meutcc.services import GoogleDriveService
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import redirect
from meutcc import settings
from base64 import b64encode
import json 
from app.models import Credenciais
from django.http import HttpResponse

class GoogleDriveView(APIView):
    googleDriveService = GoogleDriveService()

    def get(self, request):
        try:
            return self.googleDriveService.request_authorization(request)
        except Exception:
            return redirect(settings.AUTH_ERROR_FRONTEND_URL)

class GoogleDriveCallbackView(APIView):
    googleDriveService = GoogleDriveService()

    def get(self, request):
        try:
            credentials = self.googleDriveService.fetch_token(request)

            print('CREDENTIALS')
            print(credentials.token)
            print(credentials.refresh_token)
            print('--'*30)

            credencial = Credenciais.objects.first()

            if credencial:
                credencial.access_token = credentials.token
                credencial.refresh_token = credentials.refresh_token
                credencial.expires_in = credentials.expiry
                credencial.save()
            else:
                Credenciais.objects.create(
                    access_token = credentials.token,
                    refresh_token = credentials.refresh_token,
                    expires_in = credentials.expiry
                )

            return HttpResponse(status=200, content='Credenciais salvas com sucesso')
        except Exception as e:
            print(e)
            return HttpResponse(status=200, content='Erro ao salvar credenciais')