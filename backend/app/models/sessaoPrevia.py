from .base import BaseModel
from django.db import models
from . import Sessao

class SessaoPrevia(Sessao):
    """
    Modelo que representa uma sessão prévia de apresentação de TCC, herdando do modelo Sessao.
    """

    class Meta:
        abstract = False
