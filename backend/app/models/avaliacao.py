from .base import BaseModel
from django.db import models


class Avaliacao(models.Model):
    # TODO - Verificar se é necessário utilizar ListField
    notas_orientador = models.ListField(models.DoubleField())
    notas_avaliador1 = models.ListField(models.DoubleField())
    notas_avaliador2 = models.ListField(models.DoubleField()) 
    media_final = models.DoubleField()
    # TODO - Atualizar o caminho do upload
    ficha_avaliacao = models.FileField(upload_to='avaliacoes/fichas')
    data_avaliacao = models.DateTimeField()

    class meta:
        abstract = False