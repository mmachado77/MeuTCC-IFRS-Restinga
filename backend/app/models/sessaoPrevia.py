from .base import BaseModel
from django.db import models
from . import Sessao

class SessaoPrevia(Sessao):
    """
    Modelo que representa uma sessão prévia de apresentação de TCC, herdando do modelo Sessao.
    """
    comentarios_avaliador1 = models.TextField(null=True, blank=True)
    comentarios_avaliador2 = models.TextField(null=True, blank=True)
    avaliado = models.BooleanField(default=False)

    class Meta:
        abstract = False
