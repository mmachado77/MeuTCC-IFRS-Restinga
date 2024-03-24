from .base import BaseModel
from django.db import models
from . import Tcc

class Sessao(BaseModel):
    local = models.CharField(max_length=255)
    presencial = models.BooleanField()
    # TODO - Verificar propriedades dos atributos "parecer_orientador" e "parecer_coordenador"
    parecer_orientador = models.TextField(null=True, blank=True)
    parecer_coordenador = models.TextField(null=True, blank=True)
    data_inicio = models.DateTimeField()
    data_termino = models.DateTimeField()
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)

    class Meta:
        abstract = False