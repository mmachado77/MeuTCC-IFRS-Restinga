from .base import BaseModel
from django.db import models
from app.enums import StatusTccEnum
from . import Tcc

class TccStatus(BaseModel):
    """
    Modelo que representa o status de um Trabalho de Conclusão de Curso (TCC).

    Atributos:
        status (CharField): Status atual do TCC, com escolhas definidas em StatusTccEnum. Comprimento máximo de 255 caracteres.
        justificativa (TextField): Justificativa para o status atual do TCC. Pode ser null ou blank.
        dataStatus (DateTimeField): Data e hora da última alteração do status. Atualizado automaticamente.
        tcc (ForeignKey): Relacionamento com o TCC associado. Protegido contra exclusão.

    Propriedades:
        statusMensagem: Retorna a mensagem de status como uma string baseada em StatusTccEnum.
    """
    status = models.CharField(choices=StatusTccEnum.choices, max_length=255)
    justificativa = models.TextField(null=True, blank=True)
    dataStatus = models.DateTimeField(auto_now=True)
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)

    @property
    def statusMensagem(self):
        """
        Retorna a mensagem de status como uma string baseada em StatusTccEnum.

        Retorna:
            str: Mensagem de status.
        """
        return str(StatusTccEnum(self.status))

    class Meta:
        abstract = False
