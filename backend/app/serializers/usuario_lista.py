from rest_framework import serializers
from app.models import Usuario, Estudante, Professor, ProfessorInterno, ProfessorExterno, Coordenador


class UsuarioListaSerializer(serializers.ModelSerializer):
    """
    Serializer para listar usuários básicos.
    """
    status_cadastro = serializers.SerializerMethodField()
    tipo = serializers.CharField(source="tipoString", read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "nome", "email", "tipo", "status_cadastro"]

    def get_status_cadastro(self, obj):
        """
        Retorna o status do cadastro do usuário.
        Apenas professores possuem status.
        """
        if isinstance(obj, (ProfessorInterno, ProfessorExterno, Professor)) and hasattr(obj, "status"):
            return self.get_status_text(obj.status)
        return "Cadastrado"

    def get_status_text(self, status):
        """
        Retorna o texto de status do cadastro com base na aprovação e justificativa.
        """
        if status.aprovacao:
            return "Aprovado"
        elif status.justificativa:
            return "Reprovado"
        return "Pendente"


class EstudanteListaSerializer(UsuarioListaSerializer):
    """Serializer para listar estudantes."""
    class Meta:
        model = Estudante
        fields = ["id", "nome", "email", "tipo", "status_cadastro", "avatar"]


class ProfessorListaSerializer(UsuarioListaSerializer):
    """Serializer para listar professores."""
    class Meta:
        model = Professor
        fields = ["id", "nome", "email", "tipo", "status_cadastro", "avatar"]


class ProfessorInternoListaSerializer(UsuarioListaSerializer):
    """Serializer para listar professores internos."""
    class Meta:
        model = ProfessorInterno
        fields = ["id", "nome", "email", "tipo", "status_cadastro", "avatar"]


class ProfessorExternoListaSerializer(UsuarioListaSerializer):
    """Serializer para listar professores externos."""
    class Meta:
        model = ProfessorExterno
        fields = ["id", "nome", "email", "tipo", "status_cadastro", "avatar"]


class CoordenadorListaSerializer(UsuarioListaSerializer):
    """Serializer para listar coordenadores."""
    class Meta:
        model = Coordenador
        fields = ["id", "nome", "email", "tipo", "status_cadastro", "avatar"]
