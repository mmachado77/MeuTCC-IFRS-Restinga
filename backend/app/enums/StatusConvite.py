from enum import StrEnum

class StatusConvite(StrEnum):
    ANALISE = 'Convite em Análise'
    ACEITO = 'Convite Aceito'
    RECUSADO = 'Convite Recusado'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]