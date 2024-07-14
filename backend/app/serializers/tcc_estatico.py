from rest_framework import serializers
from ..models import Tcc
from ..serializers import EstudanteNomeSerializer, ProfessorNomeSerializer


class TccNomesSerializer(serializers.ModelSerializer):
    autor = EstudanteNomeSerializer()
    orientador = ProfessorNomeSerializer()
    class Meta:
        model = Tcc
        fields = ['id', 'autor', 'orientador', 'tema', 'resumo']