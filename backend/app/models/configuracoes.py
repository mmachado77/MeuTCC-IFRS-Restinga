from .base import BaseModel
from django.db import models
from .professorInterno import ProfessorInterno

class Configuracoes(BaseModel):
    
    dataAberturaPrazoPropostas = models.DateTimeField
    dataFechamentoPrazoPropostas = models.DateTimeField
    coordenadorAtual = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)

    class Meta:
        abstract = False