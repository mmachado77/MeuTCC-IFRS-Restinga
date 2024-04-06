from rest_framework import serializers
from ..models import ProfessorInterno, ProfessorExterno

class ProfessorInternoSerializer(serializers.ModelSerializer):
    tipoRegistro = serializers.SerializerMethodField()

    def get_tipoRegistro(self, obj):
        return 'Interno'

    class Meta:
        model = ProfessorInterno
        fields = '__all__'

class ProfessorExternoSerializer(serializers.ModelSerializer):
    tipoRegistro = serializers.SerializerMethodField()

    def get_tipoRegistro(self, obj):
        return 'Externo'

    class Meta:
        model = ProfessorExterno
        fields = '__all__'