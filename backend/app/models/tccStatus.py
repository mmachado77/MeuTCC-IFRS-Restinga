from .base import BaseModel
from django.db import models
from app.enums import StatusTccEnum
from . import Tcc

class TccStatus(BaseModel):
    status = models.CharField(choices=StatusTccEnum.choices, max_length=255)
    justificativa = models.TextField(null=True, blank=True)
    dataStatus = models.DateTimeField(auto_now=True)
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)

    @property
    def statusMensagem(self):
        return str(StatusTccEnum(self.status))

    class Meta:
        abstract = False
