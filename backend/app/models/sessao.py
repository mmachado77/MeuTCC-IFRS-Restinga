from django.db import models
from polymorphic.models import PolymorphicModel
from . import Tcc

class Sessao(PolymorphicModel):
    local = models.CharField(max_length=255)
    presencial = models.BooleanField()
    # TODO - Verificar propriedades dos atributos "parecer_orientador" e "parecer_coordenador"
    parecer_orientador = models.TextField(null=True, blank=True)
    parecer_coordenador = models.TextField(null=True, blank=True)
    data_inicio = models.DateTimeField()
    data_termino = models.DateTimeField()
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)

    @property
    def get_tipo(self):
        return {
            'SessaoPrevia': 'Sessão Prévia',
            'SessaoFinal': 'Sessão Final',
        }[self.__class__.__name__]

    class Meta:
        abstract = False