from .base import BaseModel
from django.db import models
from ..enums import StatusTccEnum
from .tcc import Tcc

class StatusTCC(BaseModel):
    status = models.CharField(choices=StatusTccEnum.choices, max_length=255)
    dataStatus = models.DateTimeField(auto_now=True)
    tcc = models.ForeignKey(Tcc, on_delete=models.PROTECT)

    class Meta:
        abstract = False
