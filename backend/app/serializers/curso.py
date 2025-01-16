from rest_framework import serializers
from app.models import Curso
from app.enums import RegraSessaoPublicaEnum

class CursoSimplificadoSerializer(serializers.ModelSerializer):
    """
    Serializer para retornar apenas id, sigla e nome do curso.
    """
    class Meta:
        model = Curso
        fields = ['id', 'sigla', 'nome']
        
class CursoSerializer(serializers.ModelSerializer):
    """
    Serializer para listar cursos.
    """
    regra_sessao_publica = serializers.CharField(source='get_regra_sessao_publica_display')

    class Meta:
        model = Curso
        fields = [
            'id',
            'nome',
            'sigla',
            'descricao',
            'limite_orientacoes',
            'regra_sessao_publica',
            'prazo_propostas_inicio',
            'prazo_propostas_fim',
            'ultima_atualizacao',
            'data_criacao',
        ]


class CursoCreateEditSerializer(serializers.ModelSerializer):
    """
    Serializer para criação e edição de cursos.
    """
    class Meta:
        model = Curso
        fields = '__all__'
