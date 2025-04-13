from django.shortcuts import redirect
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from meutcc import settings
from uuid import uuid4
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload, MediaIoBaseDownload
from pathlib import Path
from app.models import Credenciais
from google.oauth2.credentials import Credentials
import json

from tempfile import NamedTemporaryFile

# Classe que realiza a autenticação com o Google
# os fluxos foram baseados na documentação do Google
# https://developers.google.com/identity/protocols/oauth2/web-server?hl=pt-br
class GoogleDriveService:    
    def build_client_config_json(self):
        return {
            "web": {
                "client_id": settings.GOOGLE_DRIVE_OAUTH2_CLIENT_ID,
                "client_secret": settings.GOOGLE_DRIVE_OAUTH2_CLIENT_SECRET,
                "redirect_uris": [settings.GOOGLE_DRIVE_OAUTH2_REDIRECT_URI],                    
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            }
        }
    
    def init_flow(self, **kwargs):
        flow = google_auth_oauthlib.flow.Flow.from_client_config(client_config=self.build_client_config_json(), scopes=settings.GOOGLE_DRIVE_OAUTH2_SCOPE, **kwargs)
        flow.redirect_uri = settings.GOOGLE_DRIVE_OAUTH2_REDIRECT_URI
        return flow

    def request_authorization(self, request):
        flow = self.init_flow()
        state = str(uuid4())
        request.session['state'] = state
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            state=state)
        return redirect(authorization_url)
    
    def fetch_token(self, request):
        flow = self.init_flow(state=request.session['state'])
        authorization_response = request.build_absolute_uri()
        flow.fetch_token(authorization_response=authorization_response)
        return flow.credentials
    
    def get_user_info(self, credentials):
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        return user_info
    
    def request_callback(self, request):
        credentials = self.fetch_token(request)
        user_info = self.get_user_info(credentials)
        return user_info

    def upload_basic(self, creds):
        try:
            # create drive api client
            service = build("drive", "v3", credentials=creds)

            file_metadata = {"name": "download.jpeg"}
            media = MediaFileUpload(Path(__file__).resolve().parent / "download.txt", mimetype="image/jpeg")
            # pylint: disable=maybe-no-member
            file = (
                service.files()
                .create(body=file_metadata, media_body=media, fields="id")
                .execute()
            )
            print(f'File ID: {file.get("id")}')

        except HttpError as error:
            print(f"An error occurred: {error}")
            file = None

        return file.get("id")
    
    def get_credentials(self):
        credencial = Credenciais.objects.first()
        data = json.loads(credencial.access_token)
        return Credentials.from_authorized_user_info(data)
        
    def upload_file(self, file):
        try:
            credentials = self.get_credentials()

            service = build("drive", "v3", credentials=credentials)

            file_metadata = {"name": file.name}

            media = MediaIoBaseUpload(file.file, mimetype=file.content_type)

            file = (
                service.files()
                .create(body=file_metadata, media_body=media, fields="id")
                .execute()
            )

            return file.get("id")
        
        except Exception as e:
            print("Erro ao fazer upload:", e)
            raise  # ← para ver o traceback completo
    
    def download_file(self, file_id):
        try:
            credentials = self.get_credentials()
            service = build("drive", "v3", credentials=credentials)
            file_metadata = service.files().get(fileId=file_id, fields='name').execute()
            file_name = file_metadata.get('name', 'downloaded_file')
            fh = NamedTemporaryFile(mode='w+b')
            downloader = MediaIoBaseDownload(fh, service.files().get_media(fileId=file_id), chunksize=1024*1024)
            done = False
            while done is False:
                _, done = downloader.next_chunk()
            fh.seek(0)
            return fh, file_name

        except Exception as e:
            return None
        
    def delete_file(self, file_id):
        try:
            credentials = self.get_credentials()
            service = build("drive", "v3", credentials=credentials)
            
            service.files().delete(fileId=file_id).execute()

            return True
        except Exception as e:
            return None

