from rest_framework import serializers
from ..models import Banca
from ..serializers import UsuarioPolymorphicSerializer

class BancaSerializer(serializers.ModelSerializer):
    professores = serializers.SerializerMethodField(method_name='get_professores')

    def get_professores(self, obj):
        professores = obj.professores.all()
        return UsuarioPolymorphicSerializer(professores, many=True).data

    class Meta:
        model = Banca
        fields = ['professores']