from django.db import models
from .base import BaseModel
from datetime import datetime
from . import Usuario

class Mensagem(BaseModel):
    """
    Modelo que representa uma mensagem.

    Atributos:
        identificador (CharField): Identificador único da mensagem. Comprimento máximo de 10 caracteres.
        descricao (CharField): Descrição da mensagem. Comprimento máximo de 255 caracteres.
        assunto (CharField): Assunto da mensagem. Comprimento máximo de 255 caracteres.
        mensagem (TextField): Conteúdo da mensagem.
        notificacao (CharField): Notificação associada à mensagem. Pode ser null ou blank. Comprimento máximo de 100 caracteres.
        url_destino (CharField): URL de destino associada à mensagem. Pode ser null ou blank. Comprimento máximo de 255 caracteres.
        data_alteracao (DateTimeField): Data e hora da última alteração da mensagem. Atribuído automaticamente na criação do registro.
        user_alteracao (OneToOneField): Usuário que fez a última alteração na mensagem. Pode ser null ou blank. Relacionamento de um-para-um com o modelo Usuario. Exclui em cascata.
    """
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