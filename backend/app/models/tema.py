from .base import BaseModel
from django.db import models
from . import Professor, Estudante, Usuario

class Tema(BaseModel):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(max_length=500)
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    class meta:
        abstract = False