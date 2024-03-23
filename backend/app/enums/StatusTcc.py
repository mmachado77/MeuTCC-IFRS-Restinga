from enum import Enum

class StatusTcc(Enum):

    PROPOSTA_ANALISE = 'Proposta em Análise'
    PROPOSTA_RECUSADA = 'Proposta Recusada'
    DESENVOVIMENTO = 'TCC em Desenvolvimento'
    PREVIA = 'Aguardando Sessão Prévia'
    REPROVADO_PREVIA = 'Reprovado na Sessão Prévia'
    FINAL = 'Aguardando Sessão Final'
    REPROVADO_FINAL = 'Reprovado na Sessão Final'
    AJUSTE = 'TCC em Fase de Ajuste'
    APROVADO = 'TCC Aprovado'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]