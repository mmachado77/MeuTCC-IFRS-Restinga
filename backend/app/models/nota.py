from django.db import models
from .base import BaseModel
from app.enums import CriteriosEnum
from datetime import datetime
from . import Professor, Avaliacao

class Nota(BaseModel):
    """
    Modelo que representa uma nota atribuída a um TCC com base em critérios específicos por um professor.

    Atributos:
        avaliacao (ForeignKey): Relacionamento com a avaliação associada. Exclui em cascata.
        professor (ForeignKey): Relacionamento com o professor que atribuiu a nota. Exclui em cascata.
        criterio (CharField): Critério avaliado, com escolhas definidas em CriteriosEnum. Comprimento máximo de 50 caracteres.
        nota (FloatField): Nota atribuída para o critério avaliado.
    """
    avaliacao = models.ForeignKey(Avaliacao, on_delete=models.CASCADE)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    criterio = models.CharField(choices=CriteriosEnum.choices, max_length=50)
    nota = models.FloatField()

    class Meta:
        unique_together = ('avaliacao', 'professor', 'criterio')