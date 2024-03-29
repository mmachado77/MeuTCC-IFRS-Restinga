from django.db import models
from . import Usuario, StatusCadastro

class Professor(Usuario):

    area = models.CharField(max_length=255)
    grau_academico = models.CharField(max_length=255)
    # TODO - Verificar se é melhor usar um campo de texto ou um campo de array
    titulos = models.TextField(max_length=255)
    status = models.OneToOneField(StatusCadastro, related_name="status_cadastro", on_delete=models.CASCADE)

    class Meta:
        abstract = False