from .base import BaseModel
from django.db import models
from .usuario import Usuario

class Coordenador(Usuario):
    
    class Meta:
        abstract: False