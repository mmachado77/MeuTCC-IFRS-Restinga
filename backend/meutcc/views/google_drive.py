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
from google.oauth2.credentials import Credentials

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

            credencial = Credenciais.objects.first()

            if credencial:
                credencial.access_token = credentials.to_json()
                credencial.save()
            else:
                Credenciais.objects.create(
                    access_token = json.dumps(credentials),
                )


            return HttpResponse(status=200, content='Credenciais salvas com sucesso')
        except Exception as e:
            print(e)
            return HttpResponse(status=200, content='Erro ao salvar credenciais')
        
class GoogleDriveUploadBasicView(APIView):
    googleDriveService = GoogleDriveService()

    def get(self, request):
        try:
            credentials = Credenciais.objects.first()

            data = json.loads(credentials.access_token)
            
            credentials = Credentials.from_authorized_user_info(data)

            self.googleDriveService.upload_basic(credentials)

            return HttpResponse(status=200, content='Credenciais salvas com sucesso')            
        except Exception as e:
            print(e)
            return HttpResponse(status=200, content='Erro ao salvar credenciais')
