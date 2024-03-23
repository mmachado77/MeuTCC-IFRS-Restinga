from django.forms import DateTimeField
from .base import BaseModel
from django.db import models
from .professor import Professor

class ProfessorInterno(Professor):
    matricula = models.IntegerField()
    horarios_atendimento = models.ListField(DateTimeField)

class meta:
    abstract = False