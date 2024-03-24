from rest_framework import serializers
from .models.professor import Professor
from .models.tcc import Tcc

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class TccSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tcc
        fields = 'autor','tema', 'resumo', 'orientador', 'coorientador'