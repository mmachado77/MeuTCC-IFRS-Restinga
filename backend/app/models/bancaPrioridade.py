from .base import BaseModel
from django.db import models
from . import Professor, Banca

class BancaPrioridade(BaseModel):

    professor = models.ForeignKey(Professor, on_delete=models.PROTECT)
    prioridade = models.IntegerField
    banca = models.ManyToManyField(Banca)

    class Meta:
        abstract = False