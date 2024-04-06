from django.db import models

class StatusTccEnum(models.TextChoices):
    PROPOSTA_ANALISE_PROFESSOR = "PROPOSTA_ANALISE_PROFESSOR"
    PROPOSTA_RECUSADA_PROFESSOR = "PROPOSTA_RECUSADA_PROFESSOR"
    PROPOSTA_ANALISE_COORDENADOR = "PROPOSTA_ANALISE_COORDENADOR"
    PROPOSTA_RECUSADA_COORDENADOR = "PROPOSTA_RECUSADA_COORDENADOR"
    DESENVOLVIMENTO = "DESENVOLVIMENTO"
    PREVIA = "PREVIA"
    REPROVADO_PREVIA = "REPROVADO_PREVIA"
    FINAL = "FINAL"
    REPROVADO_FINAL = "REPROVADO_FINAL"
    AJUSTE = "AJUSTE"
    APROVADO = "APROVADO"

    def justificativa_obrigatoria(self):
        return self in [StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR, StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR, StatusTccEnum.REPROVADO_PREVIA, StatusTccEnum.REPROVADO_FINAL]
    
    def __str__(self):
        if self == StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR:
            return "Proposta em Análise pelo Orientador"
        if self == StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR:
            return "Proposta Recusada pelo Orientador"
        if self == StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR:
            return "Proposta em Análise pelo Coordenador"
        if self == StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR:
            return "Proposta Recusada pelo Coordenador"
        if self == StatusTccEnum.DESENVOLVIMENTO:
            return "TCC em Desenvolvimento"
        if self == StatusTccEnum.PREVIA:
            return "Aguardando Sessão Prévia"
        if self == StatusTccEnum.REPROVADO_PREVIA:
            return "Reprovado na Sessão Prévia"
        if self == StatusTccEnum.FINAL:
            return "Aguardando Sessão Final"
        if self == StatusTccEnum.REPROVADO_FINAL:
            return "Reprovado na Sessão Final"
        if self == StatusTccEnum.AJUSTE:
            return "TCC em Fase de Ajuste"
        if self == StatusTccEnum.APROVADO:
            return "TCC Aprovado"
        return self