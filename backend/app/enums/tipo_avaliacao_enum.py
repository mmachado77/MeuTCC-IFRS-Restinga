from django.db import models

class TipoAvaliacaoEnum(models.TextChoices):
    ADS = 'ADS',
    NONE = 'NONE'
    
    def __str__(self):
        return self