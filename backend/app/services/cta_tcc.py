from ..enums import StatusTccEnum

# Dicionário único invertido: mapeia a abreviação para o nome completo
ETAPAS = {
    "PROPOSTA": "Submeter Proposta",
    "ANDAMENTO": "Agendar Sessão de Andamento",
    "DOCANDAMENTO": "Enviar Documento para Sessão de Andamento",
    "DEFESA": "Agendar Sessão de Defesa",
    "DOCFINAL": "Enviar Documento para Sessão Final",
    "AJUSTE": "Enviar Ajuste",
    "TERMO": "Submeter Termo de Autorização de Publicação"
}

def get_cta(checklist, status_atual):
    """
    Retorna o CTA da primeira etapa pendente no formato:
      {
        "chave": "<abreviação>",
        "valor": "<nome completo>"
      }
    Caso todas as etapas estejam concluídas, retorna None.
    """
    first_unchecked = get_first_unchecked(checklist)
    if first_unchecked is not None:
        return handle_first_unchecked(first_unchecked, status_atual)
    return None

def get_first_unchecked(checklist):
    """
    Percorre o checklist e retorna a abreviação (valor de "nome")
    da primeira etapa cujo campo 'concluido' seja False.
    """
    for etapa in checklist:
        if not etapa.get("concluido", False):
            # Aqui, o campo "nome" já contém a abreviação
            return etapa.get("nome")
    return None

def handle_first_unchecked(first_unchecked, status_atual):
    """
    Processa a etapa pendente (identificada pela abreviação) e retorna o CTA
    no formato:
      {
        "cta": {
          "chave": "<abreviação>",
          "valor": "<nome completo>"
        }
      }
    A lógica utiliza o status_atual para definir condições específicas.
    """
    match first_unchecked:
        case "PROPOSTA":
            return {"chave": "PROPOSTA", "valor": ETAPAS["PROPOSTA"]}
        case "ANDAMENTO":
            if status_atual.status == StatusTccEnum.DESENVOLVIMENTO:
                return {"chave": "ANDAMENTO", "valor": ETAPAS["ANDAMENTO"]}
            return None
        case "DOCANDAMENTO":
            if status_atual.status in [StatusTccEnum.PREVIA_AGENDADA, StatusTccEnum.PREVIA_COORDENADOR, StatusTccEnum.PREVIA_ORIENTADOR]:
                return {"chave": "DOCANDAMENTO", "valor": ETAPAS["DOCANDAMENTO"]}
            return None
        case "DEFESA":
            if status_atual.status in [StatusTccEnum.PREVIA_OK, StatusTccEnum.DESENVOLVIMENTO]:
                return {"chave": "DEFESA", "valor": ETAPAS["DEFESA"]}
        case "DOCFINAL":
            if status_atual.status in [StatusTccEnum.FINAL_ORIENTADOR, StatusTccEnum.FINAL_COORDENADOR, StatusTccEnum.FINAL_AGENDADA]:
                return {"chave": "DOCFINAL", "valor": ETAPAS["DOCFINAL"]}
        case "AJUSTE":
            return {"chave": "AJUSTE", "valor": ETAPAS["AJUSTE"]}
        case "TERMO":
            return {"chave": "TERMO", "valor": ETAPAS["TERMO"]}
        case _:
            return None
