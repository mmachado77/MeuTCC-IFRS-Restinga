from .base import BaseModel
from django.db import models

class StatusCadastro(BaseModel):
    aprovacao = models.BooleanField(default=False)
    justificativa = models.CharField(max_length=255, null=True, blank=True)
    # TODO - Verificar se é bom usar auto_now_add=True ou auto_now=True etc.
    dataStatus = models.DateTimeField(auto_now_add=True)

    class meta:
        abstract = False