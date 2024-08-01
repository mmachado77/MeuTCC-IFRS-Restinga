from .base import BaseModel
from django.db import models

class Credenciais(BaseModel):
    """
    Modelo que representa as credenciais de acesso.

    Atributos:
        access_token (TextField): Token de acesso para autenticação.
    """
    access_token = models.TextField()
    
    class Meta:
        abstract = False