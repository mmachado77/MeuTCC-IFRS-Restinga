from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Professor, ProfessorInterno, StatusCadastro
from app.serializers import UsuarioPolymorphicSerializer
from rest_framework.permissions import IsAuthenticated
from app.services.notificacoes import notificacaoService

class ProfessoresPendentesListAPIView(APIView):
    """
    API para listar todos os professores pendentes de aprovação.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        get(request, format=None): Retorna uma lista de todos os professores pendentes.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        """
        Retorna uma lista de todos os professores pendentes de aprovação.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP com a lista de professores pendentes.
        """
        professores_pendentes = Professor.objects.filter(status__aprovacao=False, status__justificativa=None)
        serializer = UsuarioPolymorphicSerializer(professores_pendentes, many=True)
        return Response(serializer.data)

class AprovarProfessorAPIView(APIView):
    """
    API para aprovar o cadastro de um professor.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        put(request, idProfessor, format=None): Aprova o cadastro de um professor.
    """
    permission_classes = [IsAuthenticated]
    notificacaoService = notificacaoService()

    def put(self, request, idProfessor, format=None):
        """
        Aprova o cadastro de um professor.

        Args:
            request (Request): A requisição HTTP.
            idProfessor (int): ID do professor.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP confirmando a aprovação ou mensagem de erro.
        """
        try:
            professor = Professor.objects.get(id=idProfessor)
            status_cadastro = professor.status
            status_cadastro.aprovacao = True
            status_cadastro.save()
            self.notificacaoService.enviarNotificacaoCadastroExternoAprovado(professor)
            return Response({'message': 'Professor aprovado com sucesso!'}, status=status.HTTP_200_OK)
        except Professor.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except StatusCadastro.DoesNotExist:
            return Response({'error': 'Status de cadastro não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

class RecusarProfessorAPIView(APIView):
    """
    API para recusar o cadastro de um professor.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        put(request, idProfessor, format=None): Recusa o cadastro de um professor.
    """
    permission_classes = [IsAuthenticated]
    notificacaoService = notificacaoService()

    def put(self, request, idProfessor, format=None):
        """
        Recusa o cadastro de um professor.

        Args:
            request (Request): A requisição HTTP.
            idProfessor (int): ID do professor.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP confirmando a recusa ou mensagem de erro.
        """
        try:
            justificativa = request.data.get('justificativa')
            if(not justificativa):
                raise Exception("O campo 'justificativa' não pode estar vazio")
            professor = Professor.objects.get(id=idProfessor)
            status_cadastro = professor.status
            status_cadastro.justificativa = justificativa
            status_cadastro.save()
            self.notificacaoService.enviarNotificacaoCadastroExternoNegado(professor, justificativa)
            return Response({'message': 'Professor reprovado com sucesso!'}, status=status.HTTP_200_OK)
        except Professor.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except StatusCadastro.DoesNotExist:
            return Response({'error': 'Status de cadastro não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
