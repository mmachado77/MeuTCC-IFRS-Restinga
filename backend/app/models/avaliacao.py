from .base import BaseModel
from django.db import models

class Avaliacao(BaseModel):
    avaliado_orientador = models.BooleanField(default=False)
    avaliado_avaliador1 = models.BooleanField(default=False)
    avaliado_avaliador2 = models.BooleanField(default=False)
    comentarios_orientador = models.TextField(null=True, blank=True)
    comentarios_avaliador1 = models.TextField(null=True, blank=True)
    comentarios_avaliador2 = models.TextField(null=True, blank=True)
    ajuste = models.BooleanField(default=False)
    descricao_ajuste = models.TextField(null=True, blank=True)
    data_entrega_ajuste = models.DateTimeField(null=True, blank=True)
    tcc_definitivo = models.FileField(upload_to='tcc/documento', null=True, blank=True)
    ficha_avaliacao = models.FileField(upload_to='avaliacoes/fichas', null=True, blank=True)
    data_avaliacao = models.DateTimeField(null=True, blank=True)
    parecer_orientador = models.TextField(null=True, blank=True)

    class meta:
        abstract = False