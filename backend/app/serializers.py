from rest_framework import serializers
from .models.professor import Professor
from django.contrib.auth.models import User
from .models.tcc import Tcc
from .models.estudante import Estudante

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class TccSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tcc
        fields = 'autor','tema', 'resumo', 'orientador', 'coorientador'

class EstudanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudante
        fields = ['id', 'nome', 'cpf', 'email', 'matricula']

