from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class UploadFileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        file_type = request.data.get('type')  # 'identidade' ou 'diploma'

        if file and file_type in ['identidade', 'diploma']:
            path = f'{file_type}s/{request.user.id}/{file.name}'
            saved_path = default_storage.save(path, ContentFile(file.read()))
            url = default_storage.url(saved_path)
            # Aqui você deve atualizar o modelo do usuário ou documento com a URL do arquivo
            return Response({'url': url, 'name': file.name, 'size': file.size})
        return Response({'error': 'Invalid file or type'}, status=400)
