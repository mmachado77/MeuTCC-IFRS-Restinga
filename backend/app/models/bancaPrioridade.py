from .base import BaseModel
from django.db import models
from .professor import Professor
from .banca import Banca

class BancaPrioridade(BaseModel):

    professor = models.ForeignKey(Professor, on_delete=models.PROTECT)
    prioridade = models.IntegerField
    banca = models.ManyToManyField(Banca)

    class Meta:
        abstract = False