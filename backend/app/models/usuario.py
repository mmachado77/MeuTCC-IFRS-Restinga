from .base import BaseModel
from django.db import models

class Usuario(BaseModel):
    nome = models.CharField(verbose_name="Nome")
    cpf = models.CharField(verbose_name="cpf")
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField(auto_now_add=True)
