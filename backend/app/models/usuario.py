from .base import BaseModel
from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel

tipos_usuario = {
    'Estudante': 'Estudante',
    'Professor': 'Professor',
    'ProfessorInterno': 'Professor Interno',
    'ProfessorExterno': 'Professor Externo',
    'Coordenador': 'Coordenador'
}

class Usuario(PolymorphicModel):
    user = models.OneToOneField(User, related_name="perfil", on_delete=models.CASCADE)
    nome = models.CharField(verbose_name="Nome", max_length=255)
    cpf = models.CharField(verbose_name="cpf", max_length=255)
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField(auto_now_add=True)

    @property
    def get_tipo(self):
        if self.__class__.__name__ not in tipos_usuario:
            return self.__class__.__name__
        return tipos_usuario[self.__class__.__name__]
    
    class Meta:
        abstract = False