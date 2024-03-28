from .base import BaseModel
from django.db import models
from . import Configuracoes
from . import ProfessorInterno

class Semestre(BaseModel):
    periodo = models.TextField(max_lenght=255, verbose_name="Período", related_name="Período", default="2024/1")
    dataAberturaSemestre = models.DateTimeField
    dataFechamentoSemestre = models.DateTimeField
    settings = models.ForeignKey(Configuracoes, on_delete=models.PROTECT)
    coordenador = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)
    
    class Meta:
        abstract = False