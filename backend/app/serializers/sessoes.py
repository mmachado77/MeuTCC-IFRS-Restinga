from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from ..serializers import BancaSerializer, BancaCompletoSerializer, AvaliacaoSerializer, FileDetailSerializer, TccNomesSerializer
from ..models import SessaoPrevia, SessaoFinal, Sessao, Banca

class SessaoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Sessao.

    Atributos:
        banca (SerializerMethodField): Campo que utiliza um método para serializar a banca associada.
        tipo (CharField): Tipo da sessão.
        documentoTCCSessao (FileDetailSerializer): Serializer aninhado para o campo de arquivo do documento TCC da sessão.

    Métodos:
        get_banca(obj): Retorna os dados serializados da banca associada.
    """
    banca = serializers.SerializerMethodField(method_name='get_banca')
    tipo = serializers.CharField(source='get_tipo')

    class Meta:
        model = Sessao
        fields = '__all__'

    def get_banca(self, obj):
        """
        Retorna os dados serializados da banca associada.

        Args:
            obj (Sessao): A instância do modelo Sessao.
        """
        banca_object = Banca.objects.get(sessao=obj)
        return BancaSerializer(banca_object).data
    
class SessaoFuturaSerializer(serializers.ModelSerializer):
    """
    Serializer para sessões futuras do modelo Sessao.

    Atributos:
        banca (SerializerMethodField): Campo que utiliza um método para serializar a banca associada.
        tipo (CharField): Tipo da sessão.
        tcc (TccNomesSerializer): Serializer aninhado para o campo do TCC.

    Métodos:
        get_banca(obj): Retorna os dados serializados da banca associada.
    """
    banca = serializers.SerializerMethodField(method_name='get_banca')
    tipo = serializers.CharField(source='get_tipo')
    tcc = TccNomesSerializer()
    class Meta:
        model = Sessao
        fields = ['id', 'tipo', 'banca', 'local', 'forma_apresentacao', 'data_inicio', 'validacaoCoordenador','validacaoOrientador', 'tcc']

    def get_banca(self, obj):
        """
        Retorna os dados serializados da banca associada.

        Args:
            obj (Sessao): A instância do modelo Sessao.
        """
        banca_object = Banca.objects.get(sessao=obj)
        return BancaCompletoSerializer(banca_object).data

class SessaoEditSerializer(serializers.ModelSerializer):
    """
    Serializer para edição do modelo Sessao.

    Atributos:
        banca (SerializerMethodField): Campo que utiliza um método para serializar a banca associada.
        tcc (TccNomesSerializer): Serializer aninhado para o campo do TCC.

    Métodos:
        get_banca(obj): Retorna os dados serializados da banca associada.
    """
    banca = serializers.SerializerMethodField(method_name='get_banca')
    tcc = TccNomesSerializer()
    class Meta:
        model = Sessao
        fields = ['banca', 'local', 'data_inicio', 'validacaoCoordenador']

    def get_banca(self, obj):
        """
        Retorna os dados serializados da banca associada.

        Args:
            obj (Sessao): A instância do modelo Sessao.
        """
        banca_object = Banca.objects.get(sessao=obj)
        return BancaCompletoSerializer(banca_object).data


class SessaoPreviaSerializer(SessaoSerializer):
    """
    Serializer para o modelo SessaoPrevia.
    """
    class Meta:
        model = SessaoPrevia
        fields = '__all__'

class SessaoFinalSerializer(SessaoSerializer):
    """
    Serializer para o modelo SessaoFinal.

    Atributos:
        avaliacao (AvaliacaoSerializer): Serializer aninhado para o campo de avaliação.
    """
    avaliacao = AvaliacaoSerializer()
    class Meta:
        model = SessaoFinal
        fields = '__all__'

class SessaoPolymorphicSerializer(PolymorphicSerializer):
    """
    Serializer polimórfico para os modelos Sessao, SessaoFinal e SessaoPrevia.

    Atributos:
        model_serializer_mapping (dict): Mapeamento dos serializers para cada modelo.

    Meta:
        model_serializer_mapping (dict): Mapeamento dos serializers para cada modelo.
    """
    model_serializer_mapping = {
        Sessao: Sessao,
        SessaoFinal: SessaoFinalSerializer,
        SessaoPrevia: SessaoPreviaSerializer,
    }