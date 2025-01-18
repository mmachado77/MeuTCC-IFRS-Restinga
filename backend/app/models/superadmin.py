from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class SuperAdminManager(BaseUserManager):
    """
    Manager personalizado para o modelo SuperAdmin.
    Permite criar superadmins e gerenciar autenticação por email.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Cria e salva um usuário SuperAdmin com email e senha.
        
        Args:
            email (str): Email do SuperAdmin.
            password (str): Senha do SuperAdmin.
            **extra_fields: Campos adicionais.
        
        Raises:
            ValueError: Se o email não for fornecido.

        Returns:
            SuperAdmin: Instância criada de SuperAdmin.
        """
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Cria e salva um superusuário SuperAdmin.
        
        Args:
            email (str): Email do SuperAdmin.
            password (str): Senha do SuperAdmin.
            **extra_fields: Campos adicionais.
        
        Raises:
            ValueError: Se as permissões is_staff ou is_superuser não forem True.

        Returns:
            SuperAdmin: Instância criada de SuperAdmin.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser deve ter is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser deve ter is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class SuperAdmin(AbstractUser):
    """
    Modelo para SuperAdmins, herdando do modelo AbstractUser do Django.
    O identificador principal é o email.
    """

    email = models.EmailField(
        unique=True,
        verbose_name='Email',
        help_text='Endereço de email único usado como identificador principal.'
    )
    username = models.CharField(
        max_length=150,
        unique=False,
        blank=True,
        null=True,
        help_text='Relacionado ao email. Não é usado diretamente para login.'
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='superadmin_groups',  # Evita conflito com o modelo User padrão
        blank=True,
        help_text='Grupos aos quais o SuperAdmin pertence.',
        verbose_name='Grupos'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='superadmin_permissions',  # Evita conflito com o modelo User padrão
        blank=True,
        help_text='Permissões específicas do SuperAdmin.',
        verbose_name='Permissões'
    )

    objects = SuperAdminManager()

    USERNAME_FIELD = 'email'  # Define o email como identificador principal
    REQUIRED_FIELDS = []  # Nenhum campo adicional é obrigatório para criação

    class Meta:
        verbose_name = 'SuperAdmin'
        verbose_name_plural = 'SuperAdmins'

    def save(self, *args, **kwargs):
        """
        Salva a instância do SuperAdmin. Relaciona o username ao email.
        """
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self):
        """
        Retorna a representação em string do SuperAdmin.
        """
        return self.email
