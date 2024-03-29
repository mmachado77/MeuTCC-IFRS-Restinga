from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from app.models import Usuario
from app.serializers import UsuarioPolymorphicSerializer

class DetalhesUsuario(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        usuario = Usuario.objects.get(user=1)
        serializer = UsuarioPolymorphicSerializer(usuario)
        print(usuario)
        # data = {
        #     'nome': estudante.nome,
        #     'cpf': estudante.cpf,
        #     'email': estudante.email,
        #     'data_cadastro': estudante.dataCadastro,
        #     'matricula': estudante.matricula,
        # }
        return Response(serializer.data)
