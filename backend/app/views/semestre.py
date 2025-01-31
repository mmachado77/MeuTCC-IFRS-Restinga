from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Semestre, ProfessorInterno
from ..serializers import SemestreSerializer, CriarSemestreSerializer
from rest_framework.permissions import IsAuthenticated
from app.permissions import *
from rest_framework.exceptions import NotFound

        
class SemestreAtualView(CustomAPIView):
    """
    API para obter o semestre atual e seu coordenador.

    Métodos:
        get(request): Retorna o semestre atual e os dados do coordenador.
    """
    def get(self, request):
        """
        Retorna o semestre atual e os dados do coordenador.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os dados do semestre atual ou mensagem de erro.
        """
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_serializer = SemestreSerializer(semestre_atual).data

            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': "Não foi possível recuperar as informações do semestre atual. Por favor, tente novamente mais tarde."}, status=status.HTTP_404_NOT_FOUND)

class SemestreView(CustomAPIView):
    """
    API para obter informações de um semestre específico.

    Métodos:
        get(request, semestreid): Retorna os dados de um semestre específico.
    """
    def get(self, request, semestreid):
        """
        Retorna os dados de um semestre específico.

        Args:
            request (Request): A requisição HTTP.
            semestreid (int): ID do semestre.

        Retorna:
            Response: Resposta HTTP com os dados do semestre ou mensagem de erro.
        """
        semestre = Semestre.objects.get(pk=semestreid)
        
        if semestre:
            semestre_serializer = SemestreSerializer(semestre).data
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': "Não foi possível recuperar as informações do semestre solicitado."}, status=status.HTTP_404_NOT_FOUND)

class SemestresView(CustomAPIView):
    """
    API para listar todos os semestres.

    Métodos:
        get(request): Retorna uma lista de todos os semestres.
    """
    def get(self, request):
        """
        Retorna uma lista de todos os semestres.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com a lista de semestres.
        """
        semestres = Semestre.objects.order_by('-dataAberturaSemestre', ).all()
        serializer = SemestreSerializer(semestres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CriarSemestreView(CustomAPIView):
    """
    API para criar um novo semestre.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        post(request, format=None): Cria um novo semestre.
    """
    permission_classes = [IsSuperAdmin]

    def post(self, request, format=None):
        """
        Cria um novo semestre.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP confirmando a criação ou mensagem de erro.
        """
        # Extrair os dados do corpo da solicitação
        dados_semestre = request.data.get('semestre', {})

        # Serializar os dados do semestre
        serializer_semestre = CriarSemestreSerializer(data=dados_semestre)
        if serializer_semestre.is_valid():
            novo_semestre = serializer_semestre.validated_data

            # Verificar se existem semestres existentes com datas sobrepostas
            semestres_sobrepostos = Semestre.objects.filter(
                Q(dataAberturaSemestre__range=[novo_semestre['dataAberturaSemestre'], novo_semestre['dataFechamentoSemestre']]) |
                Q(dataFechamentoSemestre__range=[novo_semestre['dataAberturaSemestre'], novo_semestre['dataFechamentoSemestre']])
            )
            if semestres_sobrepostos.exists():
                return Response({'status': 'error', 'message': 'As datas do semestre estão sobrepostas com semestres existentes.'}, status=status.HTTP_400_BAD_REQUEST)

            else:
                return Response(serializer_semestre.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer_semestre.errors, status=status.HTTP_400_BAD_REQUEST)
