from .base import BaseModel
from django.db import models
from . import Sessao

class SessaoPrevia(Sessao):

    class Meta:
        abstract = False
