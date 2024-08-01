from .base import BaseModel
from django.db import models

class Credenciais(BaseModel):
    """
    Modelo que representa as credenciais de acesso.

    Atributos:
        access_token (TextField): Token de acesso para autenticação.
        refresh_token (TextField): Token de atualização para obter um novo token de acesso.
        expires_in (DateTimeField): Data e hora de expiração do token de acesso.
    """
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_in = models.DateTimeField()
    
    class Meta:
        abstract = False