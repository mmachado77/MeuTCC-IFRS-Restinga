from .base import BaseModel
from django.db import models
from..enums import StatusConviteEnum
from .professor import Professor

class Convite(BaseModel):
    justificativa = models.CharField(verbose_name="Justificativa", max_length=255)
    status = models.CharField(verbose_name = "Status", choices=StatusConviteEnum.choices, default=StatusConviteEnum.ANALISE, max_length=255)
    dataConvite = models.DateTimeField(auto_now_add=True)
    dataStatus = models.DateTimeField(auto_now=True)
    professor = models.ForeignKey(Professor, on_delete=models.PROTECT)

    class Meta:
        abstract = False
