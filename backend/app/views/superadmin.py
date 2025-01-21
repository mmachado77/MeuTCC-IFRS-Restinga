from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from app.models.superadmin import SuperAdmin
from app.models.curso import Curso
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
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

class SuperAdminLoginView(APIView):
    """
    View para autenticação de SuperAdmins com Tokens.
    """

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email e senha são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Autenticar o superadmin
        superadmin = authenticate(request=request, username=email, password=password)

        if superadmin:
            try:
                # Tentar localizar o SuperAdmin relacionado ao usuário
                user = superadmin.user

                # Gerar ou obter o token
                token, created = Token.objects.get_or_create(user=user)

                return Response(
                    {
                        "message": "Login bem-sucedido!",
                        "token": token.key,
                        "isSuperAdmin": True,
                    },
                    status=status.HTTP_200_OK,
                )
            except SuperAdmin.DoesNotExist:
                # O usuário não está relacionado a um SuperAdmin
                return Response(
                    {"error": "Este usuário não tem permissões de SuperAdmin."},
                    status=status.HTTP_403_FORBIDDEN
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