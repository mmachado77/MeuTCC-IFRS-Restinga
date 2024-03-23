from .base import BaseModel
from django.db import models
from .sessao import Sessao
from .avaliacao import Avaliacao

class SessaoFinal(Sessao):

    avaliacao = models.OneToOneField(Avaliacao, on_delete=models.PROTECT, primary_key=True)

    class Meta:
        abstract = False
