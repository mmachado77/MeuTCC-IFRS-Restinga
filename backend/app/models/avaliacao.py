from .base import BaseModel
from django.db import models

class Avaliacao(BaseModel):
    # TODO - Verificar se é necessário utilizar ListField
    notas_orientador = models.FloatField()
    notas_avaliador1 = models.FloatField()
    notas_avaliador2 = models.FloatField()
    media_final = models.FloatField()
    # TODO - Atualizar o caminho do upload
    ficha_avaliacao = models.FileField(upload_to='avaliacoes/fichas')
    data_avaliacao = models.DateTimeField()

    class meta:
        abstract = False