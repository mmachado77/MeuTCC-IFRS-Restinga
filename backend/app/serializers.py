from rest_framework import serializers
from django.contrib.auth.models import User
from app.models import Tcc, Estudante, Professor

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class TccSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tcc
        fields = 'autor', 'tema', 'resumo', 'orientador', 'coorientador'

class EstudanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudante
        fields = ['id', 'nome', 'cpf', 'email', 'matricula']

