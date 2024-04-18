from rest_framework import serializers
from ..models import Banca
from ..serializers import UsuarioPolymorphicSerializer

class BancaSerializer(serializers.ModelSerializer):
    professores = serializers.SerializerMethodField(method_name='get_professores')
    #professoresSugeridos = serializers.SerializerMethodField(method_name='get_sugestoes')

    def get_professores(self, obj):
        professores = obj.professores.all()
        return UsuarioPolymorphicSerializer(professores, many=True).data

    #def get_sugestoes(self, obj):
       # professores = obj.professoresSugeridos.all()
        #return UsuarioPolymorphicSerializer(professores, many=True).data

    class Meta:
        model = Banca
        fields = ['professores', 'professoresSugeridos']