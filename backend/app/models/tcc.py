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
    documentoTCC = models.FileField(upload_to='tcc/documento', null=True, blank=True)
    autorizacaoPublicacao = models.FileField(upload_to='tcc/autorizacaoPublicacao', null=True, blank=True)
    #TODO - mudar caminho dos arquivos
    dataInicio = models.DateTimeField(default=datetime.now, null=True, blank=True)
    prazoEntregaPrevia = models.DateTimeField(default=datetime.now, null=True, blank=True)
    prazoEntregaFinal = models.DateTimeField(default=datetime.now, null=True, blank=True)

    class Meta:
        abstract = False