from django.db import models
from . import Usuario, StatusCadastro
from app.enums import GrauAcademicoEnum, AreaAtuacaoEnum, AreaInteresseEnum

class Professor(Usuario):

    area_atuacao = models.CharField(choices=AreaAtuacaoEnum.choices, max_length=255, null=True, blank=True)
    titulo = models.CharField(choices=GrauAcademicoEnum.choices, max_length=255, null=True, blank=True)
    # TODO - Verificar se é melhor usar um campo de texto ou um campo de array
    area_interesse = models.CharField(choices=AreaInteresseEnum.choices, max_length=255, null=True, blank=True)
    status = models.OneToOneField(StatusCadastro, related_name="status_cadastro", on_delete=models.CASCADE)

    class Meta:
        abstract = False