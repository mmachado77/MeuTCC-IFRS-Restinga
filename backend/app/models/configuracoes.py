from .base import BaseModel
from django.db import models
from datetime import datetime  
from . import ProfessorInterno

class Configuracoes(BaseModel):
    
    coordenadorAtual = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)

    class Meta:
        abstract = False