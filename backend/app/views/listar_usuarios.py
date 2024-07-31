from .custom_api_view import CustomAPIView
from rest_framework.response import Response

from app.models import Usuario
from app.serializers import UsuarioPolymorphicSerializer

class ListarUsuarios(CustomAPIView):

    def get(self, request, format=None):
        usuario = Usuario.objects.all()
        serializer = UsuarioPolymorphicSerializer(usuario, many=True)
        return Response(serializer.data)
