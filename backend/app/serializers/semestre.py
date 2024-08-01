from rest_framework import serializers
from ..models import Semestre, SemestreCoordenador

class SemestreSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Semestre.

    Atributos:
        statusPrazo (BooleanField): Campo que indica se o prazo de envio de propostas está aberto.
        coordenador (SerializerMethodField): Campo que utiliza um método para obter o nome do último coordenador do semestre.

    Métodos:
        ultimoCoordenador(obj): Retorna o nome do último coordenador do semestre.
    """
    statusPrazo = serializers.BooleanField(source='consulta_envio_propostas')
    coordenador = serializers.SerializerMethodField(method_name='ultimoCoordenador')

    class Meta:
        model = Semestre
        fields = '__all__'

    def ultimoCoordenador(self, obj):
        """
        Retorna o nome do último coordenador do semestre.

        Args:
            obj (Semestre): A instância do modelo Semestre.
        """
        coordenador = SemestreCoordenador.objects.filter(semestre=obj).order_by('-dataAlteracao', '-id').first()
        if coordenador:
            return coordenador.coordenador.nome    
        return None
    
class CriarSemestreSerializer(serializers.ModelSerializer):
    """
    Serializer para a criação de um semestre.
    """
    class Meta:
        model = Semestre
        fields = ['periodo', 'dataAberturaSemestre', 'dataFechamentoSemestre']


class SemestreDatasSerializer(serializers.ModelSerializer):
    """
    Serializer para as datas de envio de propostas de um semestre.
    """
    class Meta:
        model = Semestre
        fields = ['dataAberturaPrazoPropostas', 'dataFechamentoPrazoPropostas']

