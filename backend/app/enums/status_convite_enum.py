from django.db import models

class StatusConviteEnum(models.TextChoices):
    ANALISE = ("Convite em Análise")
    ACEITO = ("Convite Aceito")
    RECUSADO = ("Convite Recusado")