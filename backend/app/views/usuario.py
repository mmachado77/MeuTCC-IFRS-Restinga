from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import generics
from app.models import Professor, Estudante, ProfessorExterno, ProfessorInterno, User
from app.serializers import ProfessorSerializer, UsuarioPolymorphicSerializer, CriarUsuarioSerializer, UsuarioSerializer
from app.services import UsuarioService
from rest_framework.parsers import MultiPartParser, FormParser
from app.serializers import FileSerializer
from rest_framework.permissions import AllowAny

class CriarUsuarioView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) 
    usuario_service = UsuarioService()

    def post(self, request):
        usuario = request.user
        serializer = CriarUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            criarUsuario = self.usuario_service.criarUsuario(usuario, serializer)
            if criarUsuario is not None:
                return Response({'id': usuario.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)