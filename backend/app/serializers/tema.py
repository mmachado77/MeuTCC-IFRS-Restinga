from rest_framework import serializers
from ..models import Tema, Professor, Usuario

#class ProfessorSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Professor
#        fields = ['id', 'nome'] 
        
class UsuarioSerializerTema(serializers.ModelSerializer):
    """
    Serializer para o modelo Usuario.
    """
    class Meta:
        model = Usuario
        fields = ['id', 'nome']

class TemaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Tema.

    Atributos:
        professor_detail (ProfessorSerializer): Serializer aninhado para os detalhes do professor.

    Meta:
        model (Tema): O modelo que está sendo serializado.
        fields (list): Lista dos campos que serão incluídos na serialização.
        read_only_fields (list): Lista dos campos que serão somente leitura.

    Métodos:
        to_representation(instance): Personaliza a representação do serializer.
        update(instance, validated_data): Atualiza a instância do tema com os dados validados.
    """

    professor_detail = UsuarioSerializerTema(source='professor', read_only=True)

    class Meta:
        model = Tema
        fields = ['id', 'titulo', 'descricao', 'professor', 'professor_detail']
        read_only_fields = ['id', 'professor_detail']

    def to_representation(self, instance):
        """
        Personaliza a representação do serializer.

        Args:
            instance (Tema): A instância do modelo Tema.
        """
        representation = super().to_representation(instance)
        representation['professor'] = UsuarioSerializerTema(instance.professor).data
        return representation

    def update(self, instance, validated_data):
        """
        Atualiza a instância do tema com os dados validados.

        Args:
            instance (Tema): A instância do modelo Tema.
            validated_data (dict): Dados validados para atualizar a instância.
        """
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.save()
        return instance