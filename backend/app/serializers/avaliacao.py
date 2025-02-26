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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not instance.ficha_avaliacao:
            data['ficha_avaliacao'] = None
        if not instance.tcc_definitivo:
            data['tcc_definitivo'] = None
        return data