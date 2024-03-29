from rest_framework import serializers
from app.models import Usuario, Estudante, Professor, ProfessorInterno, ProfessorExterno, Coordenador
from rest_polymorphic.serializers import PolymorphicSerializer

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class EstudanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudante
        fields = '__all__'

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class ProfessorInternoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorInterno
        fields = '__all__'

class ProfessorExternoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfessorExterno
        fields = '__all__'

class CoordenadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordenador
        fields = '__all__'

class UsuarioPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Usuario: UsuarioSerializer,
        Estudante: EstudanteSerializer,
        Professor: ProfessorSerializer,
        ProfessorInterno: ProfessorInternoSerializer,
        ProfessorExterno: ProfessorExternoSerializer,
        Coordenador: CoordenadorSerializer
    }
