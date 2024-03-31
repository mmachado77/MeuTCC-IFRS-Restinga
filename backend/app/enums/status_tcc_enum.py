from django.db import models

class StatusTccEnum(models.TextChoices):
    PROPOSTA_ANALISE = ("Proposta em Análise")
    PROPOSTA_RECUSADA = ("Proposta Recusada")
    DESENVOLVIMENTO = ("TCC em Desenvolvimento")
    PREVIA = ("Aguardando Sessão Prévia")
    REPROVADO_PREVIA = ("Reprovado na Sessão Prévia")
    FINAL = ("Aguardando Sessão Final")
    REPROVADO_FINAL = ("Reprovado na Sessão Final")
    AJUSTE = ("TCC em Fase de Ajuste")
    APROVADO = ("TCC Aprovado")
