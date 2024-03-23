from .base import BaseModel
from django.db import models
from .sessao import Sessao
from .professor import Professor
from .bancaPrioridade import BancaPrioridade

class Banca(BaseModel):
    sessao = models.ForeignKey(Sessao, on_delete=models.PROTECT)
    professores = models.ManyToManyField(Professor)
    prioridade = models.OneToOneField(BancaPrioridade, on_delete=models.CASCADE, primary_key=True)

    class Meta:
        abstract = False

