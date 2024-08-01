from rest_framework import serializers
from ..models import ProfessorInterno, ProfessorExterno

class ProfessorInternoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo ProfessorInterno.

    Atributos:
        tipoRegistro (SerializerMethodField): Campo que utiliza um método para obter o tipo de registro ('Interno').

    Métodos:
        get_tipoRegistro(obj): Retorna 'Interno' indicando o tipo de registro.
    """
    tipoRegistro = serializers.SerializerMethodField()

    def get_tipoRegistro(self, obj):
        """
        Retorna 'Interno' indicando o tipo de registro.

        Args:
            obj (ProfessorInterno): A instância do modelo ProfessorInterno.
        """
        return 'Interno'

    class Meta:
        model = ProfessorInterno
        fields = '__all__'

class ProfessorExternoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo ProfessorExterno.

    Atributos:
        tipoRegistro (SerializerMethodField): Campo que utiliza um método para obter o tipo de registro ('Externo').

    Métodos:
        get_tipoRegistro(obj): Retorna 'Externo' indicando o tipo de registro.
    """
    tipoRegistro = serializers.SerializerMethodField()

    def get_tipoRegistro(self, obj):
        """
        Retorna 'Externo' indicando o tipo de registro.

        Args:
            obj (ProfessorExterno): A instância do modelo ProfessorExterno.
        """
        return 'Externo'

    class Meta:
        model = ProfessorExterno
        fields = '__all__'