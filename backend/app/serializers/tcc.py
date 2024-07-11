from rest_framework import serializers
from ..models import Tcc,TccStatus, SessaoPrevia, SessaoFinal, Sessao
from ..serializers import UsuarioPolymorphicSerializer, TccStatusSerializer, SessaoPolymorphicSerializer, FileDetailSerializer, EstudanteNomeSerializer, ProfessorNomeSerializer, SemestreSerializer

class TccSerializer(serializers.ModelSerializer):
    autor = UsuarioPolymorphicSerializer()
    orientador = UsuarioPolymorphicSerializer()
    coorientador = UsuarioPolymorphicSerializer()
    semestre = SemestreSerializer()
    documentoTCC = FileDetailSerializer()
    autorizacaoPublicacao = FileDetailSerializer()
    status = serializers.SerializerMethodField(method_name='get_status')
    sessoes = serializers.SerializerMethodField(method_name='get_sessoes')

    def get_status(self, obj):
        status_objects = TccStatus.objects.filter(tcc=obj)
        return TccStatusSerializer(status_objects, many=True).data

    def get_sessoes(self, obj):
        sessoes_objects = Sessao.objects.filter(tcc=obj)
        return SessaoPolymorphicSerializer(sessoes_objects, many=True).data

    class Meta:
        model = Tcc
        fields = '__all__'

class TccCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tcc
        fields = "tema", "resumo", "orientador", "coorientador"