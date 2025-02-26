from rest_framework import serializers
from ..models import Tema, Professor, Usuario, Curso

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
    professor_detail = UsuarioSerializerTema(source='professor', read_only=True)
    # Campo curso definido para receber somente o id do curso
    curso = serializers.PrimaryKeyRelatedField(queryset=Curso.objects.all())

    class Meta:
        model = Tema
        fields = ['id', 'titulo', 'descricao', 'curso', 'professor', 'professor_detail']
        read_only_fields = ['id', 'professor_detail', 'professor']

    def to_representation(self, instance):
        """
        Personaliza a representação do serializer.
        """
        representation = super().to_representation(instance)
        # Substitui o campo professor pelo serializer aninhado
        representation['professor'] = UsuarioSerializerTema(instance.professor).data
        return representation

    def create(self, validated_data):
        """
        Cria uma nova instância de Tema, associando o professor a partir do usuário autenticado.
        """
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            # Use o perfil (instância de Usuario) associado ao request.user
            validated_data['professor'] = request.user.perfil
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Atualiza a instância do Tema com os dados validados.
        """
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descricao = validated_data.get('descricao', instance.descricao)
        instance.curso = validated_data.get('curso', instance.curso)
        instance.save()
        return instance