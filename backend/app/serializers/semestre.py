from rest_framework import serializers
from ..models import Semestre

class SemestreSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Semestre.

    Atributos:
        statusPrazo (BooleanField): Campo que indica se o prazo de envio de propostas está aberto.
        coordenador (SerializerMethodField): Campo que utiliza um método para obter o nome do último coordenador do semestre.

    Métodos:
        ultimoCoordenador(obj): Retorna o nome do último coordenador do semestre.
    """
    class Meta:
        model = Semestre
        fields = ['periodo', 'dataAberturaSemestre', 'dataFechamentoSemestre']

    
class CriarSemestreSerializer(serializers.ModelSerializer):
    """
    Serializer para a criação de um semestre.
    """
    class Meta:
        model = Semestre
        fields = ['periodo', 'dataAberturaSemestre', 'dataFechamentoSemestre']
