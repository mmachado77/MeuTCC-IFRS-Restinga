from django.db import models
from .base import BaseModel
from datetime import datetime  
from . import Estudante, Professor, Semestre

class Tcc(BaseModel):
    autor = models.ForeignKey(Estudante, on_delete=models.PROTECT)
    orientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='orientador')
    coorientador = models.ForeignKey(Professor, on_delete=models.PROTECT, related_name='coorientador', null=True, blank=True)
    semestre = models.ForeignKey(Semestre, on_delete=models.PROTECT)
    tema = models.CharField(max_length=255)
    resumo = models.TextField()
    dataSubmissaoProposta = models.DateTimeField(auto_now_add=True)
    documentoTCC = models.FileField(upload_to='tcc/documento')
    autorizacaoPublicacao = models.FileField(upload_to='tcc/autorizacaoPublicacao')
    #TODO - mudar caminho dos arquivos
    dataInicio = models.DateTimeField(default=datetime.now)
    prazoEntregaPrevia = models.DateTimeField(default=datetime.now)
    prazoEntregaFinal = models.DateTimeField(default=datetime.now)

    class Meta:
        abstract = False