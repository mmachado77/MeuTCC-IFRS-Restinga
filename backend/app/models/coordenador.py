from django.db import models
from . import Usuario

class Coordenador(Usuario):
    
    class Meta:
        abstract =False