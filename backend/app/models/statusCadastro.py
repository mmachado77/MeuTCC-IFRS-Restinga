from .base import BaseModel
from django.db import models
from .professorExterno import ProfessorExterno

class StatusCadastro(BaseModel):
    aprovacao = models.BooleanField()
    justificativa = models.CharField(max_length=255, null=True, blank=True)
    # TODO - Verificar se é bom usar auto_now_add=True ou auto_now=True etc.
    dataStatus = models.DateTimeField(auto_now_add=True)
    professorExterno = models.ForeignKey(ProfessorExterno, on_delete=models.CASCADE)

    class meta:
        abstract = False