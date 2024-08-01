from rest_framework import serializers
from ..models import Tcc
from ..serializers import EstudanteNomeSerializer, ProfessorNomeSerializer


class TccNomesSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Tcc, incluindo apenas os nomes do autor e do orientador.

    Atributos:
        autor (EstudanteNomeSerializer): Serializer aninhado para o campo do autor (estudante).
        orientador (ProfessorNomeSerializer): Serializer aninhado para o campo do orientador (professor).
    """
    autor = EstudanteNomeSerializer()
    orientador = ProfessorNomeSerializer()
    class Meta:
        model = Tcc
        fields = ['id', 'autor', 'orientador', 'tema', 'resumo']