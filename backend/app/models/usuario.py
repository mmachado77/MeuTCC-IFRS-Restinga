from .base import BaseModel
from django.db import models

class Usuario(BaseModel):
    nome = models.CharField(verbose_Name="Nome")
    cpf = 