from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from app.models.superadmin import SuperAdmin
from app.models.curso import Curso
from app.serializers.curso import CursoCreateEditSerializer
from app.permissions import IsSuperAdmin
from app.views.custom_api_view import CustomAPIView
from rest_framework.authtoken.models import Token
import logging
logger = logging.getLogger(__name__)

class SuperAdminDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'superadmin'):
            return Response({
                "id": user.id,
                "email": user.email,
                "resourcetype": "SuperAdmin",
                "isSuperAdmin": hasattr(user, 'superadmin'),  # Retorna true/false
            })
        return Response({"error": "Usuário não autorizado."}, status=403)
    
class SuperAdminLoginView(APIView):
    """
    View para autenticação de SuperAdmins.

    Métodos:
        post(request): Autentica um SuperAdmin com base em email e senha.
    """

    def post(self, request):
        logger.info(f"Dados recebidos: {request.data}")
        """
        Autentica um SuperAdmin com base em email e senha.

        Args:
            request (Request): Requisição HTTP contendo os campos 'email' e 'password'.

        Retorna:
            Response: Resposta HTTP com token de autenticação ou mensagem de erro.
        """
        email = request.data.get("email")
        password = request.data.get("password")

        # Validar entrada
        if not email or not password:
            return Response(
                {"error": "Email e senha são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
         # Verifica se há uma sessão ativa de outro tipo de usuário e realiza logout
        if request.user.is_authenticated and not isinstance(request.user, SuperAdmin):
            # Invalida o token JWT, se aplicável
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()

            # Para JWT, blacklist o token atual (se aplicável)
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                try:
                    RefreshToken(token).blacklist()
                except Exception as e:
                    logger.warning(f"Erro ao blacklist token: {e}")

            # Prossegue com a tentativa de autenticação após logout do usuário anterior
            logger.info("Sessão anterior invalidada. Prosseguindo com login.")


        # Autenticar usuário usando o backend personalizado
        user = authenticate(request, username=email, password=password)

        # Verificar se o usuário é válido
        if isinstance(user, SuperAdmin) and user.is_superuser:
            # Gerar token JWT
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "message": "Login bem-sucedido!",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "isSuperAdmin": True,  # Agora retornamos explicitamente True
                },
                status=status.HTTP_200_OK
            )

        # Retornar erro caso a autenticação falhe
        return Response(
            {"error": "Credenciais inválidas ou usuário não autorizado."},
            status=status.HTTP_401_UNAUTHORIZED
        )


class GerenciarCursosView(CustomAPIView):
    """
    API para criação e edição de cursos.

    Métodos:
        POST: Cria um novo curso (somente para SuperAdmins).
        PUT: Edita um curso existente (somente para SuperAdmins).
    """
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def post(self, request):
        """
        Cria um novo curso.

        Args:
            request (Request): A requisição HTTP contendo os dados do curso.

        Retorna:
            Response: Dados do curso criado ou mensagem de erro.
        """
        try:
            serializer = CursoCreateEditSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {'status': 'error', 'message': f'Erro ao criar curso: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, curso_id):
        """
        Edita um curso existente.

        Args:
            request (Request): A requisição HTTP contendo os dados atualizados do curso.
            curso_id (int): ID do curso a ser editado.

        Retorna:
            Response: Dados do curso atualizado ou mensagem de erro.
        """
        try:
            curso = Curso.objects.get(id=curso_id)
            serializer = CursoCreateEditSerializer(curso, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Curso.DoesNotExist:
            return Response(
                {'status': 'error', 'message': 'Curso não encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'status': 'error', 'message': f'Erro ao editar curso: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )