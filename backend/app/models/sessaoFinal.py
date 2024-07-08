from .base import BaseModel
from django.db import models
from . import Sessao, Avaliacao

class SessaoFinal(Sessao):

    avaliacao = models.OneToOneField(Avaliacao, on_delete=models.PROTECT, null=True, blank=True)

    class Meta:
        abstract = False
