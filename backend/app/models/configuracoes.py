from .base import BaseModel
from django.db import models
from datetime import datetime  
from . import ProfessorInterno

class Configuracoes(BaseModel):
    
    dataAberturaPrazoPropostas = models.DateTimeField(default=datetime.now)
    dataFechamentoPrazoPropostas = models.DateTimeField(default=datetime.now)
    coordenadorAtual = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)

    class Meta:
        abstract = False