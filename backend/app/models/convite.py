from .base import BaseModel
from django.db import models
from . import Professor, Tcc

class Convite(BaseModel):
    aceito = models.BooleanField(default=False)
    justificativaRecusa = models.TextField(blank=True, null=True)
    dataConvite = models.DateTimeField(auto_now_add=True)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    tcc = models.ForeignKey(Tcc, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('professor', 'tcc')