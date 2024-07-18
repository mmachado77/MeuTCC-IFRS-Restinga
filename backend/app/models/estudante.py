from django.db import models
from . import Usuario

class Estudante(Usuario):
    matricula = models.CharField(max_length=255)
    area_interesse = models.TextField(null=True, blank=True)

    class Meta:
        abstract = False