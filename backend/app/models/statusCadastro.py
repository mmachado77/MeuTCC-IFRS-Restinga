from .base import BaseModel
from django.db import models

class StatusCadastro(BaseModel):
    """
    Modelo que representa o status de cadastro.

    Atributos:
        aprovacao (BooleanField): Indica se o cadastro foi aprovado. Valor padrão é False.
        justificativa (CharField): Justificativa para a aprovação ou reprovação do cadastro. Comprimento máximo de 255 caracteres. Pode ser null ou blank.
        dataStatus (DateTimeField): Data e hora do status do cadastro. Atribuído automaticamente na criação do registro.

    Meta:
        abstract (Boolean): Indica se este modelo é abstrato. Definido como False, o que significa que este modelo não é abstrato e criará uma tabela no banco de dados.
    """
    aprovacao = models.BooleanField(default=False)
    justificativa = models.CharField(max_length=255, null=True, blank=True)
    # TODO - Verificar se é bom usar auto_now_add=True ou auto_now=True etc.
    dataStatus = models.DateTimeField(auto_now_add=True)

    class meta:
        abstract = False