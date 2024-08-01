from rest_framework import serializers
from ..models import SemestreCoordenador

class SemestreCoordenadorSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo SemestreCoordenador.

    Atributos:
        coordenador_nome (ReadOnlyField): Campo somente leitura que obtém o nome do coordenador.
        avatar (ReadOnlyField): Campo somente leitura que obtém o avatar do coordenador.
    """
    coordenador_nome = serializers.ReadOnlyField(source='coordenador.nome')
    avatar = serializers.ReadOnlyField(source='coordenador.avatar')

    class Meta:
        model = SemestreCoordenador
        fields = '__all__'
