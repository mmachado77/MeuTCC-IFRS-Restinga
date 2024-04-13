from rest_framework import serializers
from ..models import SemestreCoordenador

class SemestreCoordenadorSerializer(serializers.ModelSerializer):
    coordenador_nome = serializers.ReadOnlyField(source='coordenador.nome')

    class Meta:
        model = SemestreCoordenador
        fields = ['coordenador_nome', 'dataAlteracao']
