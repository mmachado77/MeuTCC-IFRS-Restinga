from rest_framework import serializers
from ..models import Semestre

class SemestreSerializer(serializers.ModelSerializer):
    statusPrazo = serializers.BooleanField(source='consulta_envio_propostas')
    class Meta:
        model = Semestre
        fields = '__all__'

class SemestreDatasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = ['dataAberturaPrazoPropostas', 'dataFechamentoPrazoPropostas']
