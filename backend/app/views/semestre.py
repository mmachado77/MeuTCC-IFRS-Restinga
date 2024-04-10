from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, date
from ..models import Semestre, SemestreCoordenador, ProfessorInterno
from ..serializers import SemestreSerializer, SemestreCoordenadorSerializer, SemestreDatasSerializer
from rest_framework.permissions import IsAuthenticated

class SemestreAtualView(APIView):
    def get(self, request):
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_serializer = SemestreSerializer(semestre_atual).data
            
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                semestre_serializer['semestreCoordenador'] = semestre_coordenador_serializer
            
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)


class SemestreAtualCoordenadoresView(APIView):

    def get(self, request):
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_coordenadores = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao', '-id')
            if semestre_coordenadores:
                semestre_coordenadores_serialized = SemestreCoordenadorSerializer(semestre_coordenadores, many=True).data
                return Response(semestre_coordenadores_serialized, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Nenhum coordenador encontrado para o semestre atual."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class AlterarCoordenadorSemestre(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        try:
            id_professor = request.data.get('coordenador')
            semestre_atual = Semestre.semestre_atual()

            if semestre_atual:
                professor = ProfessorInterno.objects.get(id=id_professor)
                semestre_coordenador = SemestreCoordenador.objects.create(semestre=semestre_atual, coordenador=professor, dataAlteracao=datetime.now())
                semestre_coordenador.save()
                return Response({'message': 'Coordenador atualizado com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Semestre atual não encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        except ProfessorInterno.DoesNotExist:
            return Response({'error': 'Professor não encontrado.'}, status=status.HTTP_404_NOT_FOUND)


class AtualizarDatasPropostasView(APIView):
    def put(self, request):
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
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
