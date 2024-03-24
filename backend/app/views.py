from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models.professor import Professor
from .models.estudante import Estudante
from .models.tcc import Tcc
from .serializers import ProfessorSerializer
from .serializers import TccSerializer
from .serializers import EstudanteSerializer
from django.contrib.auth.models import User


# Create your views here.

class GetProfessores(generics.ListCreateAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class CriarTCView(APIView):
    def post(self, request):
        serializer = TccSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CriarUsuarioView(APIView):
    def post(self, request, format=None):
        serializer = EstudanteSerializer(data=request.data)
        if serializer.is_valid():
            # Cria um usuário com base nos dados recebidos
            usuario_data = serializer.validated_data
            username = usuario_data['email']
            password = usuario_data['cpf']
            user = User.objects.create_user(username=username, password=password)

            # Cria o perfil do usuário
            usuario = Estudante.objects.create(user=user, **usuario_data)
            return Response({'id': usuario.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)