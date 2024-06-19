from django.db import models
from .base import BaseModel
from datetime import datetime
from . import Usuario

class Mensagem(BaseModel):
    identificador = models.CharField(max_length=10)
    descricao = models.CharField(max_length=255)
    assunto = models.CharField(max_length=255)
    mensagem = models.TextField()
    notificacao = models.CharField(max_length=100, null=True, blank=True)
    url_destino = models.CharField(max_length=255, null=True, blank=True)
    data_alteracao = models.DateTimeField(auto_now_add=True)
    user_alteracao = models.OneToOneField(Usuario, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        abstract = False