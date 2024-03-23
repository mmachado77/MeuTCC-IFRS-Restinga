from .base import BaseModel
from django.db import models
from .professor import Professor

class Tema(BaseModel):
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(max_length=500)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)

    class meta:
        abstract = False