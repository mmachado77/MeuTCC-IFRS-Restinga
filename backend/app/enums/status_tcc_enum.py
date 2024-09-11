from django.db import models

class StatusTccEnum(models.TextChoices):
    PROPOSTA_ANALISE_PROFESSOR = "PROPOSTA_ANALISE_PROFESSOR"
    PROPOSTA_RECUSADA_PROFESSOR = "PROPOSTA_RECUSADA_PROFESSOR"
    PROPOSTA_ANALISE_COORDENADOR = "PROPOSTA_ANALISE_COORDENADOR"
    PROPOSTA_RECUSADA_COORDENADOR = "PROPOSTA_RECUSADA_COORDENADOR"
    DESENVOLVIMENTO = "DESENVOLVIMENTO"
    PREVIA_ORIENTADOR = "PREVIA_ORIENTADOR"
    PREVIA_COORDENADOR = "PREVIA_COORDENADOR"
    PREVIA_AGENDADA = "PREVIA_AGENDADA"
    REPROVADO_PREVIA = "REPROVADO_PREVIA"
    PREVIA_OK = "PREVIA_OK"
    FINAL_ORIENTADOR = "FINAL_ORIENTADOR"
    FINAL_COORDENADOR = "FINAL_COORDENADOR"
    FINAL_AGENDADA = "FINAL_AGENDADA"
    REPROVADO_FINAL = "REPROVADO_FINAL"
    AJUSTE = "AJUSTE"
    APROVADO = "APROVADO"

    def justificativa_obrigatoria(self):
        return self in [StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR, StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR, StatusTccEnum.REPROVADO_PREVIA, StatusTccEnum.REPROVADO_FINAL]

    @staticmethod
    def statusTccCancelado():
        return [
            StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR,
            StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR,
            StatusTccEnum.REPROVADO_PREVIA,
            StatusTccEnum.REPROVADO_FINAL
        ]

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
        if self == StatusTccEnum.PREVIA_ORIENTADOR:
            return "Sessão Prévia em Análise pelo Orientador"
        if self == StatusTccEnum.PREVIA_COORDENADOR:
            return "Sessão Prévia em Análise pelo Coordenador"
        if self == StatusTccEnum.PREVIA_AGENDADA:
            return "Sessão Prévia Agendada"
        if self == StatusTccEnum.REPROVADO_PREVIA:
            return "Reprovado na Sessão Prévia"
        if self == StatusTccEnum.PREVIA_OK:
            return "Prévia Aprovada"
        if self == StatusTccEnum.FINAL_ORIENTADOR:
            return "Sessão Final em Análise pelo Orientador"
        if self == StatusTccEnum.FINAL_COORDENADOR:
            return "Sessão Final em Análise pelo Coordenador"
        if self == StatusTccEnum.FINAL_AGENDADA:
            return "Sessão Final Agendada"
        if self == StatusTccEnum.REPROVADO_FINAL:
            return "Reprovado na Sessão Final"
        if self == StatusTccEnum.AJUSTE:
            return "TCC em Fase de Ajuste"
        if self == StatusTccEnum.APROVADO:
            return "TCC Aprovado"
        return self
