from rest_framework import serializers
from ..models import Tcc,StatusTCC, SessaoPrevia, SessaoFinal, Sessao
from ..serializers import UsuarioPolymorphicSerializer, StatusTccSerializer, SessaoPolymorphicSerializer

class TccSerializer(serializers.ModelSerializer):
    autor = UsuarioPolymorphicSerializer()
    orientador = UsuarioPolymorphicSerializer()
    coorientador = UsuarioPolymorphicSerializer()
    status = serializers.SerializerMethodField(method_name='get_status')
    sessoes = serializers.SerializerMethodField(method_name='get_sessoes')

    def get_status(self, obj):
        status_objects = StatusTCC.objects.filter(tcc=obj)
        return StatusTccSerializer(status_objects, many=True).data

    def get_sessoes(self, obj):
        sessoes_objects = Sessao.objects.filter(tcc=obj)
        return SessaoPolymorphicSerializer(sessoes_objects, many=True).data

    class Meta:
        model = Tcc
        fields = '__all__'

