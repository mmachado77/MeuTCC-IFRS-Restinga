from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from app.models import Curso
from app.serializers.curso import CursoCreateEditSerializer, CursoSerializer, CursoSimplificadoSerializer, CursoListSerializer
from .custom_api_view import CustomAPIView

class CursosSimplificadosView(CustomAPIView):
    """
    Retorna a lista de cursos cadastrados em formato simplificado.

    Os cursos são ordenados alfabeticamente pelo nome e incluem apenas os campos
    necessários para seleção durante o cadastro de estudantes.

    Args:
        request (Request): A requisição HTTP.

    Retorna:
        Response: Uma lista contendo os cursos no formato:
        [
            {
                "id": int,
                "sigla": str,
                "nome": str
            },
            ...
        ]
        Ou uma mensagem de erro em caso de falha.
    """
    def get(self, request):
        # Ordena os cursos alfabeticamente pelo nome
        cursos = Curso.objects.all().order_by('nome')
        serializer = CursoSimplificadoSerializer(cursos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CursoListView(APIView):
    """
    View para listar todos os cursos disponíveis.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cursos = Curso.objects.all()
        serializer = CursoListSerializer(cursos, many=True)
        return Response(serializer.data)


class CursosView(CustomAPIView):
    """
    API para listar cursos.

    Métodos:
        GET: Retorna todos os cursos cadastrados.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todos os cursos cadastrados.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Lista de cursos ou mensagem de erro.
        """
        try:
            cursos = Curso.objects.all().order_by('nome')
            serializer = CursoSerializer(cursos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'status': 'error', 'message': f'Erro ao listar cursos: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GerenciarCursosView(CustomAPIView):
    """
    API para criação e edição de cursos.

    Métodos:
        POST: Cria um novo curso (somente para superusers).
        PUT: Edita um curso existente (somente para superusers).
    """
    permission_classes = [IsAuthenticated]

    def has_permission(self, usuario):
        """
        Verifica se o usuário tem permissão para acessar esta view.

        Args:
            usuario (Usuario): Usuário autenticado no sistema.

        Retorna:
            bool: True se o usuário for superuser, False caso contrário.
        """
        return usuario.user.is_superuser

    def post(self, request):
        """
        Cria um novo curso.

        Args:
            request (Request): A requisição HTTP contendo os dados do curso.

        Retorna:
            Response: Dados do curso criado ou mensagem de erro.
        """
        if not self.has_permission(request.user):
            return Response(
                {'status': 'error', 'message': 'Você não tem permissão para executar esta ação.'},
                status=status.HTTP_403_FORBIDDEN
            )

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
        if not self.has_permission(request.user):
            return Response(
                {'status': 'error', 'message': 'Você não tem permissão para executar esta ação.'},
                status=status.HTTP_403_FORBIDDEN
            )

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
