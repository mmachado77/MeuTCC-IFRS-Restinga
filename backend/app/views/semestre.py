from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from ..models import Semestre, SemestreCoordenador
from ..serializers import SemestreSerializer, SemestreCoordenadorSerializer

class SemestreAtualView(APIView):
    def get(self, request):
        semestre_atual = Semestre.semestre_atual()
        
        if semestre_atual:
            semestre_serializer = SemestreSerializer(semestre_atual).data
            
            semestre_coordenador = SemestreCoordenador.objects.filter(semestre=semestre_atual).order_by('-dataAlteracao').first()
            if semestre_coordenador:
                semestre_coordenador_serializer = SemestreCoordenadorSerializer(semestre_coordenador).data
                semestre_serializer['semestreCoordenador'] = semestre_coordenador_serializer
            
            return Response(semestre_serializer, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Semestre atual não encontrado."}, status=status.HTTP_404_NOT_FOUND)
