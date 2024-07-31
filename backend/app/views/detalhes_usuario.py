from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from app.models import Usuario, User
from app.serializers import UsuarioPolymorphicSerializer

class DetalhesUsuario(CustomAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            usuario = Usuario.objects.get(user=request.user)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except:
            user = User.objects.get(pk=request.user.id)
            return Response({'cadastroIncompleto': True})
                    
