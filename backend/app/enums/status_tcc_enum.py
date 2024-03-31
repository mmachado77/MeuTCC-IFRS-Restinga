from django.db import models

class StatusTccEnum(models.TextChoices):
    PROPOSTA_ANALISE_ORIENTADOR = ("Proposta em Análise pelo Orientador")
    PROPOSTA_RECUSADA_ORIENTADOR = ("Proposta Recusada pelo Orientador")
    PROPOSTA_ANALISE_COORDENADOR = ("Proposta em Análise pelo Coordenador")
    PROPOSTA_RECUSADA_COORDENADOR = ("Proposta Recusada pelo Coordenador")
    DESENVOLVIMENTO = ("TCC em Desenvolvimento")
    PREVIA = ("Aguardando Sessão Prévia")
    REPROVADO_PREVIA = ("Reprovado na Sessão Prévia")
    FINAL = ("Aguardando Sessão Final")
    REPROVADO_FINAL = ("Reprovado na Sessão Final")
    AJUSTE = ("TCC em Fase de Ajuste")
    APROVADO = ("TCC Aprovado")

    def justificativa_obrigatoria(self):
        return self in [StatusTccEnum.PROPOSTA_RECUSADA_ORIENTADOR, StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR, StatusTccEnum.REPROVADO_PREVIA, StatusTccEnum.REPROVADO_FINAL]