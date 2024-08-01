import json
import logging
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.views import APIView
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



class CriarUsuarioView(APIView):
    """
    API para criação de usuário.

    Métodos:
        post(request): Cria um novo usuário.
    """
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser) 
    usuario_service = UsuarioService()
    notificacaoService = notificacaoService()

    def post(self, request):
        """
        Cria um novo usuário.

        Args:
            request (Request): A requisição HTTP contendo os dados do usuário.

        Retorna:
            Response: Resposta HTTP com o ID do usuário criado ou mensagens de erro.
        """
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

class FileUploadView(APIView):
    """
    API para upload de arquivos.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        post(request): Faz o upload de um arquivo.
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Faz o upload de um arquivo.

        Args:
            request (Request): A requisição HTTP contendo o arquivo a ser carregado.

        Retorna:
            Response: Resposta HTTP com os dados do arquivo carregado ou mensagens de erro.
        """
        file_serializer = FileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
logger = logging.getLogger(__name__)

class AtualizarPerfil(APIView):
    """
    API para atualização do perfil de usuário.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        get(request): Retorna os dados do perfil do usuário autenticado.
        put(request): Atualiza os dados do perfil do usuário autenticado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Retorna os dados do perfil do usuário autenticado.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os dados do perfil do usuário ou mensagem de erro.
        """
        try:
            usuario = Usuario.objects.get(user=request.user)
            serializer = UsuarioPolymorphicSerializer(usuario)
            return Response(serializer.data)
        except Usuario.DoesNotExist:
            logger.error("User does not exist: %s", request.user)
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, format=None):
        """
        Atualiza os dados do perfil do usuário autenticado.

        Args:
            request (Request): A requisição HTTP contendo os dados a serem atualizados.

        Retorna:
            Response: Resposta HTTP com os dados atualizados do perfil do usuário ou mensagem de erro.
        """
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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Usuario.DoesNotExist:
            logger.error("User does not exist: %s", request.user)
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error("Unexpected error: %s", str(e))
            return Response({"detail": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PerfilByIdView(APIView):
    """
    API para visualizar e atualizar o perfil de um usuário específico.

    Permissões:
        Usuários autenticados podem atualizar o próprio perfil.
        Qualquer pessoa pode visualizar o perfil de um usuário específico.

    Métodos:
        get(request, id): Retorna os dados do perfil do usuário com o ID especificado.
        put(request, id): Atualiza os dados do perfil do usuário com o ID especificado.
    """
    permission_classes = [AllowAny]

    def get(self, request, id):
        """
        Retorna os dados do perfil do usuário com o ID especificado.

        Args:
            request (Request): A requisição HTTP.
            id (int): ID do usuário.

        Retorna:
            Response: Resposta HTTP com os dados do perfil do usuário ou mensagem de erro.
        """
        try:
            usuario = Usuario.objects.get(id=id)
            serializer = UsuarioSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Usuario.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, id):
        """
        Atualiza os dados do perfil do usuário com o ID especificado.

        Args:
            request (Request): A requisição HTTP contendo os dados a serem atualizados.
            id (int): ID do usuário.

        Retorna:
            Response: Resposta HTTP com os dados atualizados do perfil do usuário ou mensagem de erro.
        """
        if not request.user.is_authenticated:
            return Response({"detail": "Autenticação necessária para atualizar o perfil."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            usuario = Usuario.objects.get(id=id)
            if usuario.user != request.user:
                return Response({"detail": "Permissão negada. Você só pode atualizar seu próprio perfil."}, status=status.HTTP_403_FORBIDDEN)
            
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

class TccsByUsuarioView(APIView):
    """
    API para listar os TCCs de um usuário específico.

    Permissões:
        Qualquer pessoa pode acessar esta API.

    Métodos:
        get(request, id, format=None): Retorna os TCCs do usuário com o ID especificado.
    """
    permission_classes = [AllowAny]

    def get(self, request, id, format=None):
        """
        Retorna os TCCs do usuário com o ID especificado.

        Args:
            request (Request): A requisição HTTP.
            id (int): ID do usuário.

        Retorna:
            Response: Resposta HTTP com os dados dos TCCs do usuário ou mensagem de erro.
        """
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
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)