from .base import BaseModel
from django.db import models
from .usuario import Usuario

class Estudante(Usuario):

    matricula = models.CharField(max_length=255)

    class Meta:
        abstract = False