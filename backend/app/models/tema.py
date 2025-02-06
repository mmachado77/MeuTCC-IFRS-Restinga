from .base import BaseModel
from django.db import models
from . import Usuario, Curso

class Tema(BaseModel):
    """
    Modelo que representa um tema de TCC.

    Atributos:
        titulo (CharField): Título do tema. Comprimento máximo de 255 caracteres.
        descricao (TextField): Descrição do tema. Comprimento máximo de 500 caracteres.
        professor (ForeignKey): Relacionamento com o professor que propôs o tema. Exclui em cascata.
    """
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(max_length=500)
    professor = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    curso = models.ForeignKey(
        Curso,
        on_delete=models.PROTECT,
        related_name="sugestoes",
        verbose_name="Curso",
        default=1
    )
    class meta:
        abstract = False