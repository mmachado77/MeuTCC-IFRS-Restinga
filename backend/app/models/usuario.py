from .base import BaseModel
from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel
from app.enums import UsuarioTipoEnum

class Usuario(PolymorphicModel):
    user = models.OneToOneField(User, related_name="perfil", on_delete=models.CASCADE)
    nome = models.CharField(verbose_name="Nome", max_length=255)
    cpf = models.CharField(verbose_name="cpf", max_length=255)
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField(auto_now_add=True)
    avatar = models.CharField(verbose_name="avatar", max_length=255, null=True, blank=True)

    @property
    def tipo(self):
        return UsuarioTipoEnum(self.__class__.__name__)

    @property
    def tipoString(self):
        return self.tipo.getTipoString()
    
    def isProfessor(self):
        return self.tipo == UsuarioTipoEnum.PROFESSOR_INTERNO or self.tipo == UsuarioTipoEnum.PROFESSOR_EXTERNO
    
    class Meta:
        abstract = False