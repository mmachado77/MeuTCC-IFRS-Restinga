from rest_framework import serializers
from ..models import SemestreCoordenador

class SemestreCoordenadorSerializer(serializers.ModelSerializer):
    coordenador_nome = serializers.ReadOnlyField(source='coordenador.nome')
    avatar = serializers.ReadOnlyField(source='coordenador.avatar')

    class Meta:
        model = SemestreCoordenador
        fields = '__all__'
