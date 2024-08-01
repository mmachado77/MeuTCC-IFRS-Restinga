from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Semestre, SemestreCoordenador, ProfessorInterno
from ..serializers import SemestreSerializer, SemestreCoordenadorSerializer, SemestreDatasSerializer, CriarSemestreSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

class SemestreDatasView(CustomAPIView):
    """
    API para obter as datas do semestre atual.

    Métodos:
        get(request): Retorna as datas do semestre atual.
    """
    def get(self, request):
        """
        Retorna as datas do semestre atual.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os dados do semestre atual ou mensagem de erro.
        """
        semestre_atual = Semestre.semestre_atual()

        if semestre_atual:
            serializer = SemestreDatasSerializer(semestre_atual)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:     
            return Response({'status': 'error', 'message': "Não há um semestre ativo."}, status=status.HTTP_404_NOT_FOUND)
        
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
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                semestre_serializer['semestreCoordenador'] = semestre_coordenador_serializer
            
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': "Não foi possível recuperar as informações do semestre atual. Por favor, tente novamente mais tarde."}, status=status.HTTP_404_NOT_FOUND)

class CoordenadorAtualView(CustomAPIView):
    """
    API para obter o coordenador do semestre atual.

    Métodos:
        get(request): Retorna o coordenador do semestre atual.
    """
    def get(self, request):
        """
        Retorna o coordenador do semestre atual.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os dados do coordenador ou mensagem de erro.
        """
        semestre_atual = Semestre.semestre_atual()

        if semestre_atual:
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
            return Response(semestre_coordenador_serializer, status=status.HTTP_200_OK)
        else:
            semestre = Semestre.objects.order_by('-dataFechamentoSemestre', '-id').first()
            if semestre:
                semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre).order_by('-dataAlteracao', '-id').first()
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                return Response(semestre_coordenador_serializer, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'error', 'message': "Não foi possível recuperar as informações do coordenador do semestre atual."}, status=status.HTTP_404_NOT_FOUND)
        

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
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                semestre_serializer['semestreCoordenador'] = semestre_coordenador_serializer
            
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'error', 'message': "Não foi possível recuperar as informações do semestre solicitado."}, status=status.HTTP_404_NOT_FOUND)

class SemestreAtualCoordenadoresView(CustomAPIView):
    """
    API para obter todos os coordenadores do semestre atual.

    Métodos:
        get(request): Retorna todos os coordenadores do semestre atual.
    """

    def get(self, request):
        """
        Retorna todos os coordenadores do semestre atual.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os dados dos coordenadores ou mensagem de erro.
        """
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_coordenadores = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id')
            if semestre_coordenadores:
                semestre_coordenadores_serialized = SemestreCoordenadorSerializer(semestre_coordenadores, many=True).data
                return Response(semestre_coordenadores_serialized, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'error', 'message': "Não foi possível recuperar a lista de coordenadores do semestre atual."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'status': 'error', 'message': "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
class SemestreCoordenadoresView(CustomAPIView):
    """
    API para obter todos os coordenadores de um semestre específico.

    Métodos:
        get(request, semestreid): Retorna todos os coordenadores de um semestre específico.
    """
    def get(self, request, semestreid):
        """
        Retorna todos os coordenadores de um semestre específico.

        Args:
            request (Request): A requisição HTTP.
            semestreid (int): ID do semestre.

        Retorna:
            Response: Resposta HTTP com os dados dos coordenadores ou mensagem de erro.
        """
        semestre = Semestre.objects.get(pk=semestreid)
        
        if semestre:
            semestre_coordenadores = SemestreCoordenador.objects.filter(semestre=semestre).order_by('-dataAlteracao', '-id')
            if semestre_coordenadores:
                semestre_coordenadores_serialized = SemestreCoordenadorSerializer(semestre_coordenadores, many=True).data
                return Response(semestre_coordenadores_serialized, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'error', 'message': "Não foi possível recuperar a lista de coordenadores do semestre solicitado."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'status': 'error', 'message': "Semestre não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class AlterarCoordenadorSemestre(CustomAPIView):
    """
    API para alterar o coordenador do semestre atual.

    Métodos:
        put(request, format=None): Altera o coordenador do semestre atual.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        """
        Altera o coordenador do semestre atual.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP confirmando a alteração ou mensagem de erro.
        """
        try:
            id_professor = request.data.get('coordenador')
            semestre_atual = Semestre.semestre_atual()

            if semestre_atual:
                professor = ProfessorInterno.objects.get(id=id_professor)
                semestre_coordenador = SemestreCoordenador.objects.create(semestre=semestre_atual, coordenador=professor, dataAlteracao=datetime.now())
                semestre_coordenador.save()
                return Response({'status': 'success', 'message': 'Coordenador atualizado com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'error', 'message': 'Semestre atual não encontrado para alterar coordenador.'}, status=status.HTTP_404_NOT_FOUND)
        except ProfessorInterno.DoesNotExist:
            return Response({'status': 'error', 'message': 'Professor não encontrado ao alterar coordenador.'}, status=status.HTTP_404_NOT_FOUND)


class AtualizarDatasPropostasView(CustomAPIView):
    """
    API para atualizar as datas de abertura e fechamento de propostas do semestre atual.

    Métodos:
        put(request): Atualiza as datas de abertura e fechamento de propostas.
    """
    def put(self, request):
        """
        Atualiza as datas de abertura e fechamento de propostas do semestre atual.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com os dados atualizados ou mensagem de erro.
        """
        try:
            data = request.data

            semestreDatas = Semestre.semestre_atual()

            if 'dataAberturaPrazoPropostas' in data:
                semestreDatas.dataAberturaPrazoPropostas = date.fromisoformat(data['dataAberturaPrazoPropostas'])
            if 'dataFechamentoPrazoPropostas' in data:
                semestreDatas.dataFechamentoPrazoPropostas = date.fromisoformat(data['dataFechamentoPrazoPropostas'])

            semestreDatas.save()

            serializer = SemestreDatasSerializer(semestreDatas)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'status': 'error', 'message': 'Não foi possível atualizar as datas de proposta do semestre atual.'}, status=status.HTTP_400_BAD_REQUEST)

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
    permission_classes = [IsAuthenticated]

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
        coordenador_id = request.data.get('coordenador_id', None)

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

            # Verificar se o coordenador existe
            coordenador = ProfessorInterno.objects.filter(id=coordenador_id).first()
            if coordenador:
                # Criar e salvar o objeto SemestreCoordenador
                semestre = serializer_semestre.save()
                semestre_coordenador = SemestreCoordenador.objects.create(
                    coordenador=coordenador,
                    semestre=semestre
                )
                return Response(serializer_semestre.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'status': 'error', 'message': 'O coordenador especificado não foi encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer_semestre.errors, status=status.HTTP_400_BAD_REQUEST)
