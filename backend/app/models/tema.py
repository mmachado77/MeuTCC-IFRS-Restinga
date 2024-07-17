from .base import BaseModel
from django.db import models
from . import Professor

class Tema(BaseModel):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(max_length=500)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    # Campo que determina se a proposta está vinculada com algum aluno ou não (disponibilidade)
    estudante = models.ForeignKey('Estudante', on_delete=models.SET_NULL, null=True, blank=True)
    class meta:
        abstract = False