from .base import BaseModel
from django.db import models
from .professor import Professor

class BancaPrioridade(BaseModel):
    prioridade1 = models.ForeignKey(Professor, on_delete=models.PROTECT)
    prioridade2 = models.ForeignKey(Professor, on_delete=models.PROTECT)
    prioridade3 = models.ForeignKey(Professor, on_delete=models.PROTECT)
    prioridade4 = models.ForeignKey(Professor, on_delete=models.PROTECT)
    prioridade5 = models.ForeignKey(Professor, on_delete=models.PROTECT)

    class Meta:
        abstract = False