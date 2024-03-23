from .base import BaseModel
from django.db import models
from..enums import StatusConvite
from .professor import Professor

class Convite(BaseModel):
    justificativa = models.CharField(verbose_name="Justificativa")
    status = models.CharField(verbose_name = "Status", choices=StatusConvite.choices(), default=StatusConvite.ANALISE)
    dataConvite = models.DateTimeField.auto_now_add
    dataStatus = models.DateTimeField.auto_now
    professor = models.ForeignKey(Professor, on_delete=models.PROTECT)

    class Meta:
        abstract = False
