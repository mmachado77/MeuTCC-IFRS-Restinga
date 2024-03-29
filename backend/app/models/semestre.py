from .base import BaseModel
from django.db import models
from . import Configuracoes
from . import ProfessorInterno
from datetime import datetime  

class Semestre(BaseModel):
    periodo = models.CharField(max_length=255, verbose_name="Período", default="2024/1")
    dataAberturaSemestre = models.DateTimeField(default=datetime.now)
    dataFechamentoSemestre = models.DateTimeField(default=datetime.now)
    settings = models.ForeignKey(Configuracoes, on_delete=models.PROTECT)
    coordenador = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)
    
    class Meta:
        abstract = False