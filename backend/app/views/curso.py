from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from app.models import Curso
from app.permissions import *
from app.serializers.curso import *
from .custom_api_view import CustomAPIView
from django.shortcuts import get_object_or_404

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
    View para listar cursos disponíveis.
    Retorna:
    - Apenas o curso associado, se for Coordenador.
    - Todos os cursos, se for SuperAdmin.
    """
    permission_classes = [IsSuperAdminOrCoordenador]

    def get(self, request):
        user = request.user

        # Verifica se o usuário é um SuperAdmin
        if SuperAdmin.objects.filter(user=user).exists():
            cursos = Curso.objects.all()

        # Verifica se o usuário é um Coordenador
        elif Coordenador.objects.filter(user=user).exists():
            try:
                coordenador = Coordenador.objects.get(user=user)
                cursos = Curso.objects.filter(id=coordenador.curso.id)  # Retorna apenas o curso do coordenador
            except Coordenador.DoesNotExist:
                raise PermissionDenied("Você não está associado a nenhum curso como coordenador.")

        # Caso não seja SuperAdmin nem Coordenador
        else:
            raise PermissionDenied("Você não tem permissão para visualizar os cursos.")

        # Serializa e retorna os cursos
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
        
class CursoConcorrenciaView(APIView):
    """
    API para obter os campos de concorrência de um curso.
    """
    permission_classes = [IsSuperAdminOrCoordenador]

    def get(self, request, pk):
        try:
            curso = Curso.objects.get(pk=pk)
        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CursoConcorrenciaSerializer(curso)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CursoDetailView(APIView):
    """
    View para obter e editar todos os campos de um curso.
    Apenas acessível para SuperAdmins.
    """
    permission_classes = [IsSuperAdminOrCoordenador]

    def get(self, request, curso_id):
        try:
            # Obtém o curso pelo ID
            curso = Curso.objects.get(pk=curso_id)
        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serializa os dados do curso
        serializer = CursoDetailSerializer(curso)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, curso_id):
        try:
            curso = Curso.objects.get(pk=curso_id)
        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CursoEditSerializer(curso, data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Adiciona os campos de concorrência ao response
            concorrencia_serializer = CursoConcorrenciaSerializer(curso)
            response_data = serializer.data
            response_data.update(concorrencia_serializer.data)

            return Response(
                {"message": "Curso atualizado com sucesso!", "curso": response_data},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TrocaCoordenadorAPIView(APIView):
    """
    API para realizar a troca de coordenador de um curso.
    """
    permission_classes = [IsSuperAdminOrCoordenador]  # Apenas superadmin pode realizar a ação

    def put(self, request, curso_id):
        try:
            # Obtendo o curso e o professor a partir dos IDs fornecidos
            curso = Curso.objects.get(id=curso_id)
            professor_id = request.data.get('professor_id')

            if not professor_id:
                return Response(
                    {"error": "O ID do professor é obrigatório."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            novo_coordenador = ProfessorInterno.objects.get(id=professor_id)

            # Criar novo registro no histórico de coordenadores
            HistoricoCoordenadorCurso.objects.create(
                curso=curso,
                coordenador=novo_coordenador
            )

            return Response(
                {
                    "message": "Coordenador atualizado com sucesso.",
                    "coordenador_atual": {
                        "id": novo_coordenador.id,
                        "nome": novo_coordenador.nome,
                        "email": novo_coordenador.email,
                        "avatar": novo_coordenador.avatar
                    }
                },
                status=status.HTTP_200_OK
            )

        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ProfessorInterno.DoesNotExist:
            return Response(
                {"error": "Professor não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class HistoricoCoordenadorAPIView(APIView):
    """
    View para retornar o histórico de coordenadores de um curso.
    """
    permission_classes = [IsSuperAdminOrCoordenador] 
    def get(self, request, curso_id):
        try:
            curso = Curso.objects.get(id=curso_id)
            historico = curso.get_historico_coordenadores()

            return Response(historico, status=status.HTTP_200_OK)
        except Curso.DoesNotExist:
            return Response(
                {"error": "Curso não encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        
from app.serializers.curso import ProfessorSerializer

class AdicionarProfessorCursoView(APIView):
    """
    View para adicionar um professor a um curso.

    Método POST:
    - Requer o ID do curso na URL (curso_id).
    - Requer o ID do professor no corpo da requisição (professor_id).
    - Adiciona o professor especificado ao curso informado.
    - Retorna uma mensagem de sucesso, a lista atualizada de professores ou um erro caso o professor já esteja associado ao curso.
    """
    permission_classes = [IsSuperAdminOrCoordenador]

    def post(self, request, curso_id):
        curso = get_object_or_404(Curso, id=curso_id)
        professor_id = request.data.get("professor_id")

        if not professor_id:
            return Response({"erro": "O campo 'professor_id' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        professor = get_object_or_404(ProfessorInterno, id=professor_id)
        curso.professores.add(professor)
        curso.save()

        professores = ProfessorSerializer(curso.professores.all(), many=True)

        return Response(
            {
                "mensagem": f"Professor {professor.nome} adicionado ao curso {curso.nome} com sucesso.",
                "professores": professores.data,
            },
            status=status.HTTP_200_OK,
        )


class RemoverProfessorCursoView(APIView):
    """
    View para remover um professor de um curso.

    Método DELETE:
    - Requer o ID do curso na URL (curso_id).
    - Requer o ID do professor no corpo da requisição (professor_id).
    - Remove o professor especificado do curso informado.
    - Retorna uma mensagem de sucesso, a lista atualizada de professores ou um erro caso o professor não esteja associado ao curso.
    """
    permission_classes = [IsSuperAdminOrCoordenador]

    def delete(self, request, curso_id):
        curso = get_object_or_404(Curso, id=curso_id)
        professor_id = request.data.get("professor_id")

        if not professor_id:
            return Response({"erro": "O campo 'professor_id' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        professor = get_object_or_404(ProfessorInterno, id=professor_id)
        curso.professores.remove(professor)
        curso.save()

        professores = ProfessorSerializer(curso.professores.all(), many=True)

        return Response(
            {
                "mensagem": f"Professor {professor.nome} removido do curso {curso.nome} com sucesso.",
                "professores": professores.data,
            },
            status=status.HTTP_200_OK,
        )
