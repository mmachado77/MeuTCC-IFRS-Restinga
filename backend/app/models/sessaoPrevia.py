from .base import BaseModel
from django.db import models
from .sessao import Sessao

class SessaoPrevia(Sessao):

    class Meta:
        abstract = False
