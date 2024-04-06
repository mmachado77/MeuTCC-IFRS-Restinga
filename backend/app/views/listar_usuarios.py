from rest_framework.views import APIView
from rest_framework.response import Response

from app.models import Usuario
from app.serializers import UsuarioPolymorphicSerializer

class ListarUsuarios(APIView):

    def get(self, request, format=None):
        usuario = Usuario.objects.all()
        serializer = UsuarioPolymorphicSerializer(usuario, many=True)
        return Response(serializer.data)
