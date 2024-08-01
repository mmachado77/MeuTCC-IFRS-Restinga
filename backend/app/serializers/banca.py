from rest_framework import serializers
from ..models import Banca
from ..serializers import UsuarioPolymorphicSerializer, ProfessorNomeSerializer

class BancaSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Banca.

    Atributos:
        professores (SerializerMethodField): Campo que utiliza um método para serializar os professores associados.

    Métodos:
        get_professores(obj): Retorna os dados serializados dos professores associados utilizando UsuarioPolymorphicSerializer.
    """
    professores = serializers.SerializerMethodField(method_name='get_professores')
    #professoresSugeridos = serializers.SerializerMethodField(method_name='get_sugestoes')

    def get_professores(self, obj):
        """
        Retorna os dados serializados dos professores associados.

        Args:
            obj (Banca): A instância do modelo Banca.

        Retorna:
            list: Dados serializados dos professores.
        """
        professores = obj.professores.all()
        return UsuarioPolymorphicSerializer(professores, many=True).data

    #def get_sugestoes(self, obj):
       # professores = obj.professoresSugeridos.all()
        #return UsuarioPolymorphicSerializer(professores, many=True).data

    class Meta:
        model = Banca
        fields = ['professores']

class BancaCompletoSerializer(serializers.ModelSerializer):
    """
    Serializer completo para o modelo Banca.

    Atributos:
        professores (ProfessorNomeSerializer): Campo para serializar os professores associados utilizando ProfessorNomeSerializer.
    """
    professores = ProfessorNomeSerializer(many=True)
    class Meta:
        model = Banca
        fields = ['professores']
        depth = 1