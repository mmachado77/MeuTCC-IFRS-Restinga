from .base import BaseModel
from django.db import models

class Usuario(BaseModel):
    nome = models.CharField(verbose_Name="Nome")
    cpf = models.CharField(verbose_Name="cpf")
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField.auto_now_add
