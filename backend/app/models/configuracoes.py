from .base import BaseModel
from django.db import models
from datetime import datetime  
from . import ProfessorInterno

class Configuracoes(BaseModel):
    
    dataAberturaPrazoPropostas = models.DateField(auto_now_add=True)
    dataFechamentoPrazoPropostas = models.DateField(auto_now_add=False)
    coordenadorAtual = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)

    class Meta:
        abstract = False