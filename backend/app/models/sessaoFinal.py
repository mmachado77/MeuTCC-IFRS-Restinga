from .base import BaseModel
from django.db import models
from .sessao import Sessao
from .avaliacao import Avaliacao

class SessaoFinal(Sessao):

    avaliacao = models.ForeignKey(Avaliacao, on_delete=models.PROTECT)

    class Meta:
        abstract = False
