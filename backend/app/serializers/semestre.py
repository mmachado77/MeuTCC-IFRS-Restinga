from rest_framework import serializers
from ..models import Semestre, SemestreCoordenador

class SemestreSerializer(serializers.ModelSerializer):
    statusPrazo = serializers.BooleanField(source='consulta_envio_propostas')
    coordenador = serializers.SerializerMethodField(method_name='ultimoCoordenador')

    class Meta:
        model = Semestre
        fields = '__all__'

    def ultimoCoordenador(self, obj):
        coordenador = SemestreCoordenador.objects.filter(semestre=obj).order_by('-dataAlteracao', '-id').first()
        if coordenador:
            return coordenador.coordenador.nome    
        return None
    
class CriarSemestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = ['periodo', 'dataAberturaSemestre', 'dataFechamentoSemestre']


class SemestreDatasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semestre
        fields = ['dataAberturaPrazoPropostas', 'dataFechamentoPrazoPropostas']

