from .custom_api_view import CustomAPIView
from rest_framework import generics, status
from rest_framework.response import Response
from app.models import Professor, ProfessorInterno, StatusCadastro
from app.serializers import UsuarioPolymorphicSerializer
from rest_framework.permissions import IsAuthenticated
from app.services.notificacoes import notificacaoService

class ProfessoresPendentesListAPIView(CustomAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        professores_pendentes = Professor.objects.filter(status__aprovacao=False, status__justificativa=None)
        serializer = UsuarioPolymorphicSerializer(professores_pendentes, many=True)
        return Response(serializer.data)

class AprovarProfessorAPIView(CustomAPIView):
    permission_classes = [IsAuthenticated]
    notificacaoService = notificacaoService()

    def put(self, request, idProfessor, format=None):
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

class RecusarProfessorAPIView(CustomAPIView):
    permission_classes = [IsAuthenticated]
    notificacaoService = notificacaoService()

    def put(self, request, idProfessor, format=None):
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
