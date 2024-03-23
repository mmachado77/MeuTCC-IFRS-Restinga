from .base import BaseModel
from django.db import models
from .sessao import Sessao
from .professor import Professor
from .bancaPrioridade import BancaPrioridade

class Banca(BaseModel):
    sessao = models.ForeignKey(Sessao, on_delete=models.PROTECT)
    professores = models.ManyToManyField(Professor)

    class Meta:
        abstract = False


#    def get_prioridades(self):
 #       busca = BancaPrioridade.objects.all()
  #      return list(busca)

