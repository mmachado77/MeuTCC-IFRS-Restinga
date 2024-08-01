from rest_framework import serializers
from ..models import Avaliacao
from ..serializers import FileDetailSerializer

class AvaliacaoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Avaliacao.

    Atributos:
        tcc_definitivo (FileDetailSerializer): Serializer aninhado para o campo de arquivo TCC definitivo.
        ficha_avaliacao (FileDetailSerializer): Serializer aninhado para o campo de arquivo ficha de avaliação.
    """
    tcc_definitivo = FileDetailSerializer()
    ficha_avaliacao = FileDetailSerializer()
    class Meta:
        model = Avaliacao
        fields = '__all__'