from .base import BaseModel
from django.db import models
from..enums import StatusTcc
from .tcc import Tcc

class StatusTCC(BaseModel):
    status = models.CharField(verbose_name = "Status", choices=StatusTcc.choices(), default=StatusTcc.PROPOSTA_ANALISE)
    dataStatus = models.DateTimeField.auto_now
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)

    class Meta:
        abstract = False
