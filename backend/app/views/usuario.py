import json
import logging
from .custom_api_view import CustomAPIView
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import generics
from app.models import Professor, Estudante, ProfessorExterno, ProfessorInterno, User, Usuario, Tcc
from app.serializers import ProfessorSerializer, UsuarioPolymorphicSerializer, CriarUsuarioSerializer, UsuarioSerializer, EstudanteSerializer, TccSerializer
from app.services import UsuarioService
from rest_framework.parsers import MultiPartParser, FormParser
from app.serializers import FileSerializer
from app.services.notificacoes import notificacaoService
from rest_framework.permissions import AllowAny
from django.db.models import Q



class CriarUsuarioView(CustomAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) 
    usuario_service = UsuarioService()
    notificacaoService = notificacaoService()

    def post(self, request):
        usuario = request.user
        serializer = CriarUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            criarUsuario = self.usuario_service.criarUsuario(usuario, serializer)
            if criarUsuario is not None:
                #self.notificacaoService.enviarNotificacaoCadastroExterno(request.user, serializer) NÃO FOI POSSÍVEL TESTAR
                return Response({'id': usuario.id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileUploadView(CustomAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
logger = logging.getLogger(__name__)

class AtualizarPerfil(CustomAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            usuario = Usuario.objects.get(user=request.user)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            logger.error("User does not exist: %s", request.user)
            return Response({'status': 'error', 'message': 'Usuário não existe.'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        try:
            usuario = Usuario.objects.get(user=request.user)
            if usuario.id != request.data.get('id'):
                return Response({"detail": "Permissão negada. Você só pode atualizar seu próprio perfil."}, status=status.HTTP_403_FORBIDDEN)
            
            data = request.data
            logger.debug("Request data: %s", data)
            data['email'] = usuario.email  # Ensure email is not changed

            if 'area_interesse' in data and isinstance(data['area_interesse'], str):
                try:
                    data['area_interesse'] = json.loads(data['area_interesse'])
                except json.JSONDecodeError as e:
                    logger.error("JSON decode error: %s", str(e))
                    return Response({"detail": "Invalid JSON format for area_interesse"}, status=status.HTTP_400_BAD_REQUEST)
            
            logger.debug("Parsed request data: %s", data)

            serializer = UsuarioPolymorphicSerializer(usuario, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                logger.info("Profile updated successfully for user: %s", request.user)
                return Response(serializer.data)
            
            logger.error("Invalid data: %s", serializer.errors)
            return Response({'status': 'error', 'message': 'Data inválida'},serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Usuario.DoesNotExist:
            logger.error("User does not exist: %s", request.user)
            return Response({'status': 'error', 'message': 'Usuário não existe'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error("Unexpected error: %s", str(e))
            return Response({'status': 'error', 'message': 'Erro inesperado. Tente novamente mais tarde'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PerfilByIdView(CustomAPIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            usuario = Usuario.objects.get(id=id)
            serializer = UsuarioSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'status': 'error', 'message': "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, id):
        if not request.user.is_authenticated:
            return Response({'status': 'error', 'message': "Autenticação necessária para atualizar o perfil."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            usuario = Usuario.objects.get(id=id)
            if usuario.user != request.user:
                return Response({'status': 'error', 'message': "Permissão negada. Você só pode atualizar seu próprio perfil."}, status=status.HTTP_403_FORBIDDEN)
            
            data = request.data
            if 'area_interesse' in data and isinstance(data['area_interesse'], list):
                data['area_interesse'] = json.dumps(data['area_interesse'])

            serializer = UsuarioSerializer(usuario, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class TccsByUsuarioView(CustomAPIView):
    permission_classes = [AllowAny]

    def get(self, request, id, format=None):
        try:
            usuario = Usuario.objects.get(id=id)
            
            if isinstance(usuario, Estudante):
                tccs = Tcc.objects.filter(autor=usuario)
            elif isinstance(usuario, Professor):
                tccs = Tcc.objects.filter(Q(orientador=usuario) | Q(coorientador=usuario))
            else:
                return Response([], status=status.HTTP_200_OK)
                
            serializer = TccSerializer(tccs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({'status': 'error', 'message': "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)