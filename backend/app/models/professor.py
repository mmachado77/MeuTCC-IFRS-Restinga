from django.db import models
from .usuario import Usuario

class Professor(Usuario):

    area = models.CharField(max_length=255)
    grau_academico = models.CharField(max_length=255)
    # TODO - Verificar se é melhor usar um campo de texto ou um campo de array
    titulos = models.TextField(max_length=255)

    class Meta:
        abstract = False