from rest_framework import serializers
from ..models import Tema, Professor, Usuario

#class ProfessorSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Professor
#        fields = ['id', 'nome'] 
        
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome']

class TemaSerializer(serializers.ModelSerializer):
    professor_detail = UsuarioSerializer(source='professor', read_only=True)

    class Meta:
        model = Tema
        fields = ['id', 'titulo', 'descricao', 'professor', 'professor_detail']
        read_only_fields = ['id', 'professor_detail']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['professor'] = UsuarioSerializer(instance.professor).data
        return representation

    def update(self, instance, validated_data):
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.save()
        return instance