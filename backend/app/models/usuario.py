from .base import BaseModel
from django.db import models
from django.contrib.auth.models import User
from polymorphic.models import PolymorphicModel
from app.enums import UsuarioTipoEnum

class Usuario(PolymorphicModel):
    """
    Modelo que representa um usuário do sistema, utilizando herança polimórfica para diferentes tipos de usuários.

    Atributos:
        user (OneToOneField): Relacionamento de um-para-um com o modelo User do Django. Exclui em cascata.
        nome (CharField): Nome completo do usuário. Comprimento máximo de 255 caracteres.
        cpf (CharField): CPF do usuário. Comprimento máximo de 255 caracteres.
        email (EmailField): Endereço de email do usuário. Comprimento máximo de 254 caracteres.
        dataCadastro (DateTimeField): Data e hora do cadastro do usuário. Atribuído automaticamente na criação do registro.
        avatar (CharField): URL do avatar do usuário. Pode ser null ou blank. Comprimento máximo de 255 caracteres.
        linkedin (CharField): URL do perfil do LinkedIn do usuário. Pode ser null ou blank. Comprimento máximo de 255 caracteres.
        github (CharField): URL do perfil do GitHub do usuário. Pode ser null ou blank. Comprimento máximo de 255 caracteres.

    Propriedades:
        tipo: Retorna o tipo de usuário como um valor de UsuarioTipoEnum.
        tipoString: Retorna a string do tipo de usuário.
    
    Métodos:
        isProfessor(): Verifica se o usuário é um professor (interno ou externo).
    """
    user = models.OneToOneField(User, related_name="perfil", on_delete=models.CASCADE)
    nome = models.CharField(verbose_name="Nome", max_length=255)
    cpf = models.CharField(verbose_name="cpf", max_length=255)
    email = models.EmailField(max_length = 254)
    dataCadastro = models.DateTimeField(auto_now_add=True)
    avatar = models.CharField(verbose_name="avatar", max_length=255, null=True, blank=True)
    linkedin = models.CharField(max_length=255, null=True, blank=True)
    github = models.CharField(max_length=255, null=True, blank=True)

    @property
    def tipo(self):
        """
        Retorna o tipo de usuário como um valor de UsuarioTipoEnum.

        Retorna:
            UsuarioTipoEnum: Tipo de usuário.
        """
        return UsuarioTipoEnum(self.__class__.__name__)

    @property
    def tipoString(self):
        """
        Retorna a string do tipo de usuário.

        Retorna:
            str: String do tipo de usuário.
        """
        return self.tipo.getTipoString()
    
    def isProfessor(self):
        """
        Verifica se o usuário é um professor (interno ou externo).

        Retorna:
            bool: True se o usuário for um professor interno ou externo, caso contrário, False.
        """
        return self.tipo == UsuarioTipoEnum.PROFESSOR_INTERNO or self.tipo == UsuarioTipoEnum.PROFESSOR_EXTERNO
    
    class Meta:
        abstract = False