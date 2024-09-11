from rest_framework import serializers
from django.contrib.auth.models import User
from app.models import Tcc, Estudante, Professor

class ProfessorSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Professor.
    """
    class Meta:
        model = Professor
        fields = '__all__'

class TccSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Tcc.
    """
    class Meta:
        model = Tcc
        fields = 'autor', 'tema', 'resumo', 'orientador', 'coorientador'

class EstudanteSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Estudante.
    """
    class Meta:
        model = Estudante
        fields = ['id', 'nome', 'cpf', 'email', 'matricula']
        
