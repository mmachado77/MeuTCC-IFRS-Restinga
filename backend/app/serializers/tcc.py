from rest_framework import serializers
from ..models import Tcc,TccStatus, SessaoPrevia, SessaoFinal, Sessao, Tema, Usuario
from app.enums import StatusTccEnum, UsuarioTipoEnum
from ..serializers import UsuarioPolymorphicSerializer, TccStatusSerializer, SessaoPolymorphicSerializer, FileDetailSerializer, EstudanteNomeSerializer, ProfessorNomeSerializer, SemestreSerializer

class TccSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Tcc.

    Atributos:
        autor (UsuarioPolymorphicSerializer): Serializer aninhado para o autor do TCC.
        orientador (UsuarioPolymorphicSerializer): Serializer aninhado para o orientador do TCC.
        coorientador (UsuarioPolymorphicSerializer): Serializer aninhado para o coorientador do TCC.
        semestre (SemestreSerializer): Serializer aninhado para o semestre do TCC.
        documentoTCC (FileDetailSerializer): Serializer aninhado para o documento do TCC.
        autorizacaoPublicacao (FileDetailSerializer): Serializer aninhado para a autorização de publicação do TCC.
        status (SerializerMethodField): Campo que utiliza um método para serializar os status do TCC.
        sessoes (SerializerMethodField): Campo que utiliza um método para serializar as sessões do TCC.

    Métodos:
        get_status(obj): Retorna os dados serializados dos status associados ao TCC.
        get_sessoes(obj): Retorna os dados serializados das sessões associadas ao TCC.
    """
    autor = UsuarioPolymorphicSerializer()
    orientador = UsuarioPolymorphicSerializer()
    coorientador = UsuarioPolymorphicSerializer()
    semestre = SemestreSerializer()
    documentoTCC = FileDetailSerializer()
    autorizacaoPublicacao = FileDetailSerializer()
    status = serializers.SerializerMethodField(method_name='get_status')
    sessoes = serializers.SerializerMethodField(method_name='get_sessoes')

    def get_status(self, obj):
        """
        Retorna os dados serializados dos status associados ao TCC.

        Args:
            obj (Tcc): A instância do modelo Tcc.
        """
        status_objects = TccStatus.objects.filter(tcc=obj)
        return TccStatusSerializer(status_objects, many=True).data

    def get_sessoes(self, obj):
        """
        Retorna os dados serializados das sessões associadas ao TCC.

        Args:
            obj (Tcc): A instância do modelo Tcc.
        """
        sessoes_objects = Sessao.objects.filter(tcc=obj)
        return SessaoPolymorphicSerializer(sessoes_objects, many=True).data

    class Meta:
        model = Tcc
        fields = '__all__'

class TccCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para a criação de um TCC.
    """
    class Meta:
        model = Tcc
        fields = "tema", "resumo", "orientador", "coorientador"

class TccEditSerializer(serializers.ModelSerializer):
    """
    Serializer para a edição de um TCC.

    Este serializer é usado para validar os campos que podem ser editados por
    diferentes tipos de usuários. Ele inclui lógica de validação para garantir
    que apenas os campos permitidos sejam modificados de acordo com as permissões do usuário.
    """
    class Meta:
        model = Tcc
        fields = ["tema", "resumo", "orientador", "coorientador"]

    def validate(self, data):
        try:
            usuario = Usuario.objects.get(user=self.context['request'].user)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Perfil de usuário não encontrado.")

        # Recupera o objeto TCC sendo editado
        tcc = self.instance

        # Autores e Orientadores podem editar apenas "tema" e "resumo"
        if usuario.id == tcc.autor.id or usuario.id == tcc.orientador.id:
            restricted_fields = [field for field in data.keys() if field not in ["tema", "resumo"]]
            if restricted_fields:
                raise serializers.ValidationError("Você não tem permissão para editar esses campos.")

        # Coordenadores podem editar todos os campos
        if usuario.tipo == UsuarioTipoEnum.COORDENADOR:
            return data

        # Caso não seja autor, orientador ou coordenador
        raise serializers.ValidationError("Você não tem permissão para editar este TCC.")

