from django.db import models
from . import Semestre, ProfessorInterno

class SemestreCoordenador(models.Model):
    """
    Modelo que representa a relação entre um coordenador e um semestre específico.

    Atributos:
        dataAlteracao (DateField): Data da última alteração, preenchida automaticamente com a data atual.
        coordenador (ForeignKey): Relacionamento com o professor interno que é o coordenador. Protegido contra exclusão.
        semestre (ForeignKey): Relacionamento com o semestre associado. Exclui em cascata. Preenchido automaticamente com o semestre atual, se não especificado.

    Métodos:
        save(*args, **kwargs): Sobrescreve o método save para definir o semestre atual, se não estiver especificado.
    """
    dataAlteracao = models.DateField(auto_now_add=True)
    coordenador = models.ForeignKey(ProfessorInterno, on_delete=models.PROTECT)
    semestre = models.ForeignKey(Semestre, on_delete=models.CASCADE, default=None)

    class Meta:
        abstract = False

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para definir o semestre atual, se não estiver especificado.

        Args:
            *args: Argumentos posicionais.
            **kwargs: Argumentos nomeados.
        """
        if not self.semestre:
            self.semestre = Semestre.semestre_atual()
        super().save(*args, **kwargs)
