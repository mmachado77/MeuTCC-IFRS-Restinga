from .base import BaseModel
from django.db import models
from .professor import Professor

class Configuracoes(BaseModel):
    
    dataAberturaPrazoPropostas = models.DateTimeField
    dataFechamentoPrazoPropostas = models.DateTimeField
    coordenadorAtual = models.ForeignKey(Professor, on_delete=models.PROTECT)

    class Meta:
        abstract: False