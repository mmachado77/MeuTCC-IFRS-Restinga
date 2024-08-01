from .custom_api_view import CustomAPIView
from rest_framework.response import Response

from app.models import Usuario
from app.serializers import UsuarioPolymorphicSerializer

class ListarUsuarios(CustomAPIView):
    """
    API para listar todos os usuários.

    Métodos:
        get(request, format=None): Retorna uma lista de todos os usuários.
    """
    def get(self, request, format=None):
        """
        Retorna uma lista de todos os usuários.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP com a lista de usuários ou mensagem de erro.
        """
        usuario = Usuario.objects.all()
        serializer = UsuarioPolymorphicSerializer(usuario, many=True)
        return Response(serializer.data)
