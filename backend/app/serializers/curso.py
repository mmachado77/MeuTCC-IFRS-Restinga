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

class CoordenadorNomeSerializer(serializers.Serializer):
    """
    Serializer para retornar apenas o nome e o ID do coordenador.
    """
    id = serializers.IntegerField()
    nome = serializers.CharField()

class CursoListSerializer(serializers.ModelSerializer):
    """
    Serializer para listar cursos com sigla, nome e coordenador atual.
    """
    coordenador_atual = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = ['id', 'sigla', 'nome', 'coordenador_atual']

    def get_coordenador_atual(self, obj):
        coordenador = obj.get_coordenador_atual()
        if coordenador:
            return CoordenadorNomeSerializer(coordenador).data
        return None 


class CursoCreateEditSerializer(serializers.ModelSerializer):
    """
    Serializer para criação e edição de cursos.
    """
    class Meta:
        model = Curso
        fields = '__all__'
