from .base import BaseModel
from django.db import models
from . import Professor, Tcc

class Convite(BaseModel):
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    tcc = models.ForeignKey(Tcc, on_delete=models.CASCADE)
    aceito = models.BooleanField(default=False)
    justificativa_recusa = models.TextField(blank=True, null=True)
    data_convite = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('professor', 'tcc')