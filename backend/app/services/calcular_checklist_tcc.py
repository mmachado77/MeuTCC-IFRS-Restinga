from ..models import SessaoPrevia, SessaoFinal, Avaliacao, TccStatus, Curso
from ..enums import RegraSessaoPublicaEnum, StatusTccEnum
from ..services.status_mapping_service import get_status_mapping

# Dicionário de mapeamento para as ações
ACAO_MAPPING = {
    "PROPOSTA": "Submeter Proposta",
    "ANDAMENTO": "Agendar Sessão de Andamento",
    "DOCANDAMENTO": "Enviar Documento para Sessão de Andamento",
    "DEFESA": "Agendar Sessão de Defesa",
    "DOCFINAL": "Enviar Documento para Sessão Final",
    "AJUSTE": "Enviar Ajuste",
    "TERMO": "Submeter Termo de Autorização de Publicação"
}

def calcular_checklist_tcc(tcc):
    """
    Retorna uma lista de etapas do TCC, cada qual com:
      - nome: chave de cada etapa;
      - acao: ação descritiva da etapa;
      - obrigatorio: se a etapa é obrigatória;
      - concluido: se a etapa foi concluída;
    """
    etapas = []
    
    # 1) Submeter Proposta -> "PROPOSTA"
    etapas.append({
        "nome": "PROPOSTA",
        "acao": ACAO_MAPPING.get("PROPOSTA"),
        "obrigatorio": True,
        "concluido": True,
    })
    
    # Recuperar os status do TCC e o status atual
    status_objects = TccStatus.objects.filter(tcc=tcc)
    status_tcc = status_objects.order_by('-dataStatus').first()
    status_atual = status_tcc.status
    
    # Recuperar o curso e determinar a regra da sessão
    curso = Curso.objects.get(id=tcc.curso.id)
    regra_sessao = RegraSessaoPublicaEnum(curso.regra_sessao_publica)

    
    for status_obj in status_objects:
        if status_obj.status == StatusTccEnum.PREVIA_ORIENTADOR:
            regra_sessao = RegraSessaoPublicaEnum.OBRIGATORIO
            break
    
    # Obter o mapping de status para essa regra
    mapping = get_status_mapping(regra_sessao)

    # 2) Agendar Sessão Prévia -> "ANDAMENTO"
    if regra_sessao == RegraSessaoPublicaEnum.OBRIGATORIO:
        etapas.append({
            "nome": "ANDAMENTO",
            "acao": ACAO_MAPPING.get("ANDAMENTO"),
            "obrigatorio": True,
            "concluido": previaOrientador(mapping, status_atual),
        })
    
    # 3) Submeter Documento para Sessão Prévia -> "DOCANDAMENTO"
    if regra_sessao != RegraSessaoPublicaEnum.DESABILITAR and StatusTccEnum.PREVIA_ORIENTADOR in status_objects:
        sessao_previa = SessaoPrevia.objects.filter(tcc=tcc).first()
        etapas.append({
            "nome": "DOCANDAMENTO",
            "acao": ACAO_MAPPING.get("DOCANDAMENTO"),
            "obrigatorio": True,
            "concluido": bool(getattr(sessao_previa, 'documentoTCCSessao', None)),
        })
    
    # 4) Agendar Sessão Final -> "DEFESA"
    etapas.append({
        "nome": "DEFESA",
        "acao": ACAO_MAPPING.get("DEFESA"),
        "obrigatorio": True,
        "concluido": finalOrientador(mapping, status_atual),
    })
    
    # 5) Submeter Documento para Sessão Final -> "DOCFINAL"
    sessao_final = SessaoFinal.objects.filter(tcc=tcc).first()
    if sessao_final:
        item_concluido = bool(getattr(sessao_final, 'documentoTCCSessao', None))
        item_obrigatorio = True
    else:
        item_concluido = False
        item_obrigatorio = False
    etapas.append({
        "nome": "DOCFINAL",
        "acao": ACAO_MAPPING.get("DOCFINAL"),
        "obrigatorio": item_obrigatorio,
        "concluido": item_concluido,
    })

    # 6) Submeter Documento Ajustado -> "AJUSTE"
    sessao_final_avaliacao = SessaoFinal.objects.filter(tcc=tcc).first()
    avaliacao = getattr(sessao_final_avaliacao, 'avaliacao', None)
    if avaliacao and avaliacao.ajuste:
        etapas.append({
            "nome": "AJUSTE",
            "acao": ACAO_MAPPING.get("AJUSTE"),
            "obrigatorio": True,
            "concluido": bool(getattr(avaliacao, 'tcc_definitivo', None)),
        })
    
    # 7) Submeter Termo de Autorização de Publicação -> "TERMO"
    etapas.append({
        "nome": "TERMO",
        "acao": ACAO_MAPPING.get("TERMO"),
        "obrigatorio": True,
        "concluido": bool(getattr(tcc, 'autorizacaoPublicacao', None)),         
    })
    
    return etapas

def previaOrientador(mapping, status_atual):
    sessaoPreviaMapeada = next((map for map in mapping if map['status'] == StatusTccEnum.PREVIA_ORIENTADOR), None)
    statusAtualMapeado = next((map for map in mapping if map['status'] == status_atual), None)
    return statusAtualMapeado.get('index') >= sessaoPreviaMapeada.get('index')

def finalOrientador(mapping, status_atual):
    sessaoPreviaMapeada = next((map for map in mapping if map['status'] == StatusTccEnum.FINAL_ORIENTADOR), None)
    statusAtualMapeado = next((map for map in mapping if map['status'] == status_atual), None)
    return statusAtualMapeado.get('index') >= sessaoPreviaMapeada.get('index')
