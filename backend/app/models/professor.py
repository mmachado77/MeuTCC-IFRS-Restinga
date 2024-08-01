from django.db import models
from . import Usuario, StatusCadastro
from app.enums import GrauAcademicoEnum, AreaAtuacaoEnum, AreaInteresseEnum
from django.core.serializers.json import DjangoJSONEncoder
import json

class Professor(Usuario):
    """
    Modelo que representa um Professor, herdando do modelo Usuario.

    Atributos:
        area_atuacao (CharField): Área de atuação do professor, com escolhas definidas em AreaAtuacaoEnum. Comprimento máximo de 255 caracteres. Pode ser null ou blank.
        titulo (CharField): Título acadêmico do professor, com escolhas definidas em GrauAcademicoEnum. Comprimento máximo de 255 caracteres. Pode ser null ou blank.
        area_interesse (TextField): Áreas de interesse do professor. Armazenado como um campo de texto JSON. Pode ser null ou blank.
        status (OneToOneField): Status de cadastro do professor. Relacionamento de um-para-um com o modelo StatusCadastro. Exclui em cascata.

    Métodos:
        set_area_interesse(data): Converte a lista de áreas de interesse para JSON e a armazena no campo area_interesse.
        get_area_interesse(): Recupera e retorna a lista de áreas de interesse a partir do campo area_interesse armazenado como JSON. Retorna uma lista vazia em caso de erro.
    """
    area_atuacao = models.CharField(choices=AreaAtuacaoEnum.choices, max_length=255, null=True, blank=True)
    titulo = models.CharField(choices=GrauAcademicoEnum.choices, max_length=255, null=True, blank=True)
    # TODO - Verificar se é melhor usar um campo de texto ou um campo de array
    area_interesse = models.TextField(null=True, blank=True)
    status = models.OneToOneField(StatusCadastro, related_name="status_cadastro", on_delete=models.CASCADE)

    def set_area_interesse(self, data):
        """
        Converte a lista de áreas de interesse para JSON e a armazena no campo area_interesse.
        
        Args:
            data (list): Lista de áreas de interesse.
        """
        self.area_interesse = json.dumps(data)

    def get_area_interesse(self):
        """
        Recupera e retorna a lista de áreas de interesse a partir do campo area_interesse armazenado como JSON.
        
        Returns:
            list: Lista de áreas de interesse. Retorna uma lista vazia em caso de erro.
        """
        try:
            return json.loads(self.area_interesse)
        except ValueError:
            return []

    class Meta:
        abstract = False