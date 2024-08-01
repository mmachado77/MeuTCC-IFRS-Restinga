from django.db import models
from . import Professor

class ProfessorInterno(Professor):
    """
    Modelo que representa um Professor Interno, herdando do modelo Professor.

    Atributos:
        matricula (CharField): Número de matrícula do professor interno. Comprimento máximo de 255 caracteres.
    """

    matricula = models.CharField(max_length=255)

    class Meta:
        abstract = False

class HorarioAtendimento(models.Model):
    """
    Modelo que representa o horário de atendimento de um professor interno.

    Atributos:
        professor (ForeignKey): Relacionamento com o professor interno associado. Exclui em cascata. Relacionamento de muitos-para-um com o modelo ProfessorInterno.
        horario (DateTimeField): Data e hora do atendimento.
    """
    professor = models.ForeignKey(ProfessorInterno, on_delete=models.CASCADE, related_name='horarios_atendimento')
    horario = models.DateTimeField()

    class Meta:
        abstract = False