from django.shortcuts import render
from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.models import Professor, Estudante, Tcc, ProfessorInterno
from app.serializers import ProfessorSerializer, UsuarioPolymorphicSerializer, TccSerializer, EstudanteSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from datetime import date


# Create your views here.

class GetProfessores(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class GetProfessoresInternos(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        usuario = ProfessorInterno.objects.all()
        serializer = UsuarioPolymorphicSerializer(usuario, many=True)
        return Response(serializer.data)

# class CriarUsuarioView(APIView):
#     def post(self, request, format=None):
#         serializer = EstudanteSerializer(data=request.data)
#         if serializer.is_valid():
#             # Cria um usuário com base nos dados recebidos
#             usuario_data = serializer.validated_data
#             username = usuario_data['email']
#             password = usuario_data['cpf']
#             user = User.objects.create_user(username=username, password=password)

#             # Cria o perfil do usuário
#             usuario = Estudante.objects.create(user=user, **usuario_data)
#             return Response({'id': usuario.id}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ObterTokenView(CustomAPIView):
    def post(self, request, format=None):
        username = request.data.get('username')
        
        try:
            user = User.objects.get(email=username)
            token = Token.objects.get_or_create(user=user)
            return Response({'token': token[0].key}, status=200)

        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado.'}, status=404)
        
        
class DetalhesEstudanteView(CustomAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        estudante = Estudante.objects.get(user=request.user)
        data = {
            'nome': estudante.nome,
            'cpf': estudante.cpf,
            'email': estudante.email,
            'data_cadastro': estudante.dataCadastro,
            'matricula': estudante.matricula,
        }
        return Response(data)
    

