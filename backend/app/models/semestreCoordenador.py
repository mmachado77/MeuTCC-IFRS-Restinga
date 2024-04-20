from django.db import models
from . import Semestre, ProfessorInterno

class SemestreCoordenador(models.Model):
    dataAlteracao = models.DateField(auto_now_add=True)
    coordenador = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE, default=None)

    class Meta:
        abstract = False

    def save(self, *args, **kwargs):
        if not self.semestre:
            self.semestre = Semestre.semestre_atual()
        super().save(*args, **kwargs)
