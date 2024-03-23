from .base import BaseModel
from django.db import models
from .usuario import Usuario

class Estudante(Usuario):

    matricula = models.IntegerField

    class Meta:
        abstract: False