from .base import BaseModel
from django.db import models
from django.db.models import Q
from datetime import datetime  

class Semestre(BaseModel):
    """
    Modelo que representa um semestre acadêmico.

    Atributos:
        periodo (CharField): Período do semestre. Comprimento máximo de 255 caracteres. Valor padrão é "2024/1".
        dataAberturaSemestre (DateField): Data de abertura do semestre. Valor padrão é a data atual.
        dataFechamentoSemestre (DateField): Data de fechamento do semestre. Valor padrão é a data atual.
    
    Métodos:
        semestre_atual(): Retorna o semestre atual com base na data de consulta.
    """

    periodo = models.CharField(max_length=255, verbose_name="Período", default="2024/1")
    dataAberturaSemestre = models.DateField(default=datetime.today)
    dataFechamentoSemestre = models.DateField(default=datetime.today)

    class Meta:
        abstract = False

    def semestre_atual():
        """
        Retorna o semestre atual com base na data de consulta.

        Retorna:
            Semestre: O semestre atual, se existir. Caso contrário, retorna None.
        """
        data_consulta = datetime.today().date()
        
        semestres = Semestre.objects.filter(
            Q(dataAberturaSemestre__lte=data_consulta) &
            Q(dataFechamentoSemestre__gte=data_consulta)
        )
        
        #TODO: Pensar sobre a possibilidade de não haver semestres ativos (página de submissão recebe erro 404f)
        if semestres.exists():
            return semestres.first()
        else:
            return None
        