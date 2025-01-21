from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from app.models import Curso
from app.permissions import IsSuperAdmin
from app.serializers.curso import CursoDetailSerializer, CursoSerializer, CursoSimplificadoSerializer, CursoListSerializer
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
    permission_classes = [IsSuperAdmin]

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
    permission_classes = []

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
class CursoDetailView(APIView):
    """
    View para obter e editar todos os campos de um curso.
    Apenas acessível para SuperAdmins.
    """
    permission_classes = [IsSuperAdmin]

    def get(self, request, pk):
        try:
            # Obtém o curso pelo ID
            curso = Curso.objects.get(pk=pk)
        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serializa os dados do curso
        serializer = CursoDetailSerializer(curso)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            # Obtém o curso pelo ID
            curso = Curso.objects.get(pk=pk)
        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Atualiza os dados do curso com os dados fornecidos
        serializer = CursoDetailSerializer(curso, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Curso atualizado com sucesso!", "curso": serializer.data},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)