from .base import BaseModel
from django.db import models
from . import Sessao, Avaliacao
from django.db.models.signals import post_save
from django.dispatch import receiver

class SessaoFinal(Sessao):
    """
    Modelo que representa uma sessão final de apresentação de TCC, herdando do modelo Sessao.

    Atributos:
        avaliacao (OneToOneField): Relacionamento de um-para-um com o modelo Avaliacao. Protegido contra exclusão. Pode ser null ou blank.
    """
    avaliacao = models.OneToOneField(Avaliacao, on_delete=models.PROTECT, null=True, blank=True)

    class Meta:
        abstract = False

@receiver(post_save, sender=SessaoFinal)
def create_avaliacao(sender, instance, created, **kwargs):
    """
    Sinal que cria automaticamente uma avaliação associada quando uma nova SessaoFinal é criada.

    Args:
        sender (class): A classe do modelo que enviou o sinal.
        instance (SessaoFinal): A instância do modelo que foi salva.
        created (bool): Um valor booleano; True se uma nova instância foi criada.
        **kwargs: Argumentos adicionais.
    """
    if created:
        avaliacao = Avaliacao.objects.create()
        instance.avaliacao = avaliacao
        instance.save()