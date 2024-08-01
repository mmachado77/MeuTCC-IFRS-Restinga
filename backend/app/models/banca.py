from .base import BaseModel
from django.db import models
from datetime import datetime
from . import Sessao, Professor, Usuario

class Banca(BaseModel):
    """
    Modelo que representa uma banca avaliadora de TCC.

    Atributos:
        sessao (ForeignKey): Relacionamento com a sessão em que a banca está inserida. Não permite exclusão em cascata (on_delete=models.PROTECT).
        professores (ManyToManyField): Relacionamento com os professores que compõem a banca. É permitido estar em branco.
        autorSugestao (ForeignKey): Usuário que sugeriu a banca. Permite valores nulos e estar em branco (on_delete=models.SET_NULL).
        dataSugestao (DateTimeField): Data e hora em que a sugestão da banca foi feita. Valor atribuído automaticamente na criação do registro.
    """
    sessao = models.ForeignKey(Sessao, on_delete=models.PROTECT)
    professores = models.ManyToManyField(Professor, related_name='banca_professores', blank=True)
    autorSugestao = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True)
    dataSugestao = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    
    class Meta:
        abstract = False