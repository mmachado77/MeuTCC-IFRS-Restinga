from django.db import models
from . import Professor

class ProfessorInterno(Professor):
    matricula = models.CharField(max_length=255)

    class Meta:
        abstract = False

class HorarioAtendimento(models.Model):
    professor = models.ForeignKey(ProfessorInterno, on_delete=models.CASCADE, related_name='horarios_atendimento')
    horario = models.DateTimeField()

    class Meta:
        abstract = False