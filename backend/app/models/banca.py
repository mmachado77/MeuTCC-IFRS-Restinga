from .base import BaseModel
from django.db import models
from . import Sessao, Professor

class Banca(BaseModel):
    sessao = models.ForeignKey(Sessao, on_delete=models.PROTECT)
    professores = models.ManyToManyField(Professor)

    class Meta:
        abstract = False
