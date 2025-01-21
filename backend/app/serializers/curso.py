from rest_framework import serializers
from app.models import Curso
from app.models.professor import *
from app.models.historicoCoordenadorCurso import *
from app.models.coordenador import *
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

class ProfessorSerializer(serializers.ModelSerializer):
    """
    Serializa os professores associados ao curso.
    """
    class Meta:
        model = ProfessorInterno
        fields = ['nome', 'email']  # Retorna apenas nome e email

class HistoricoCoordenadorSerializer(serializers.ModelSerializer):
    """
    Serializa os coordenadores anteriores do curso.
    """
    coordenador = serializers.CharField(source='coordenador.nome')  # Nome do coordenador
    data_alteracao = serializers.DateTimeField(format='%d/%m/%Y')  # Formata a data

    class Meta:
        model = HistoricoCoordenadorCurso
        fields = ['coordenador', 'data_alteracao']

class CursoDetailSerializer(serializers.ModelSerializer):
    """
    Serializa todos os dados de um curso, incluindo coordenador, professores e histórico.
    """
    coordenador_atual = serializers.SerializerMethodField()
    historico_coordenadores = HistoricoCoordenadorSerializer(many=True, source='historico_coordenadores.all')
    professores = ProfessorSerializer(many=True)

    class Meta:
        model = Curso
        fields = [
            'id', 'nome', 'sigla', 'descricao', 'ultima_atualizacao', 'data_criacao',
            'limite_orientacoes', 'regra_sessao_publica', 'prazo_propostas_inicio',
            'prazo_propostas_fim', 'coordenador_atual', 'historico_coordenadores', 'professores'
        ]

    def get_coordenador_atual(self, obj):
        # Obtém o professor coordenador (nome)
        professor_coordenador = obj.get_coordenador_atual()

        # Obtém o email do coordenador relacionado ao curso
        coordenador = Coordenador.objects.filter(curso=obj).first()

        if coordenador and professor_coordenador:
            return {
                "nome": professor_coordenador.nome,
                "email": coordenador.email
            }
        return None
