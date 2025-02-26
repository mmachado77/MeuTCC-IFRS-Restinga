from typing import List, Dict
from ..enums import StatusTccEnum, RegraSessaoPublicaEnum

def get_status_mapping(regra_sessao: RegraSessaoPublicaEnum) -> List[Dict]:
    """
    Gera o mapeamento dos status do TCC com índice, obrigatoriedade, valor do status, 
    mensagem explicativa e instruções para o usuário.
    
    Cada item do mapping contém:
      - index: Ordem do status no fluxo.
      - required: Booleano indicando se o status é obrigatório.
      - status: Valor do status (conforme StatusTccEnum).
      - mensagem: Mensagem amigável que contextualiza o status atual do TCC.
      - instrucoes: Orientação prática sobre o próximo passo a ser executado ou aguardado.
    
    O mapeamento é montado de acordo com a regra de sessão pública informada:
      - Se a regra for OBRIGATÓRIO ou OPCIONAL, são incluídos os status referentes à sessão prévia.
      - Se a regra for DESABILITAR, os status da prévia são omitidos e o fluxo segue diretamente para a sessão final.
    
    Exemplos de instruções:
      - "Aguarde que o Coordenador do Curso avalie sua proposta"
      - "Agende a Sessão Pública de Andamento/Defesa do seu TCC"
      - "Prepare-se e aguarde o dia da Sessão Pública de Andamento/Defesa"
    
    :param regra_sessao: Instância de RegraSessaoPublicaEnum (DESABILITAR, OPCIONAL, OBRIGATÓRIO)
    :return: Lista de dicionários contendo 'index', 'required', 'status', 'mensagem' e 'instrucoes'
    """
    mapping = []
    index = 1

    # 1. Proposta em Análise pelo Professor
    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR,
        "mensagem": "Sua proposta já foi enviada e está aguardando análise do Professor Orientador.",
        "instrucoes": "Aguarde a avaliação do seu Professor Orientador."
    })
    index += 1

    # 2. Proposta Recusada pelo Professor (fim de ciclo)
    mapping.append({
        "index": index,
        "required": False,
        "status": StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR,
        "mensagem": "Sua proposta foi recusada pelo Professor Orientador. O TCC foi encerrado.",
        "instrucoes": "Consulte seu orientador para maiores informações."
    })
    index += 1

    # 3. Proposta em Análise pelo Coordenador
    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR,
        "mensagem": "Sua proposta foi aceita pelo Professor Orientador e agora está em análise pelo Coordenador do Curso.",
        "instrucoes": "Aguarde que o Coordenador do Curso avalie sua proposta."
    })
    index += 1

    # 4. Proposta Recusada pelo Coordenador (fim de ciclo)
    mapping.append({
        "index": index,
        "required": False,
        "status": StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR,
        "mensagem": "Sua proposta foi recusada pelo Coordenador do Curso. O TCC foi encerrado.",
        "instrucoes": "Consulte o seu orientador para maiores informações."
    })
    index += 1

    # 5. TCC em Desenvolvimento
    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.DESENVOLVIMENTO,
        "mensagem": "O Coordenador do Curso aprovou sua proposta de TCC. Hora de Desenvolver o seu Projeto.",
        "instrucoes": "Desenvolva seu projeto e prepare a documentação para a próxima etapa."
    })
    index += 1

    # Status referentes à sessão prévia (somente se as sessões não estiverem desabilitadas)
    if regra_sessao is not RegraSessaoPublicaEnum.DESABILITAR:
        # Se a sessão prévia for obrigatória, marca como obrigatória; se opcional, flag False.
        if regra_sessao is RegraSessaoPublicaEnum.OBRIGATORIO:
            previa_required = True
        else:
            previa_required = False
        # 6. Sessão Prévia em Análise pelo Orientador
        mapping.append({
            "index": index,
            "required": previa_required,
            "status": StatusTccEnum.PREVIA_ORIENTADOR,
            "mensagem": "Você enviou os detalhes da Sessão Pública de Andamento para análise do Professor Orientador.",
            "instrucoes": "Você já pode agendar sua Sessão Pública de Andamento."
        })
        index += 1

        # 7. Sessão Prévia em Análise pelo Coordenador
        mapping.append({
            "index": index,
            "required": previa_required,
            "status": StatusTccEnum.PREVIA_COORDENADOR,
            "mensagem": "Os detalhes da Sessão Pública de Andamento estão sendo analisados pelo Coordenador do Curso.",
            "instrucoes": "Aguarde que o Orientador encaminhe o agendamento Sessão Pública de Andamento."
        })
        index += 1

        # 8. Sessão Prévia Agendada
        mapping.append({
            "index": index,
            "required": previa_required,
            "status": StatusTccEnum.PREVIA_AGENDADA,
            "mensagem": "A Sessão Pública de Andamento foi agendada. Fique atento à data e horário.",
            "instrucoes": "Aguarde que o Coordenador aceite o agendamento Sessão Pública de Andamento."
        })
        index += 1

        # 9. Pós-sessão prévia:
        # - Se obrigatória: status de reprovação, caso ocorra.
        # - Se opcional: status considerado como aprovado automaticamente.
        if regra_sessao == RegraSessaoPublicaEnum.OBRIGATORIO:
            mapping.append({
                "index": index,
                "required": False,
                "status": StatusTccEnum.REPROVADO_PREVIA,
                "mensagem": "Infelizmente, você reprovou na sessão prévia. O TCC foi encerrado.",
                "instrucoes": "Consulte seu orientador para discutir alternativas."
            })
            index += 1
            mapping.append({
                "index": index,
                "required": True,
                "status": StatusTccEnum.PREVIA_OK,
                "mensagem": "Sua Sessão Pública de Andamento foi aprovada. Continue com o desenvolvimento do TCC.",
                "instrucoes": "Aguarde que seu Orientador poste a avaliação da sua Sessão Pública de Andamento"
            })
            index += 1
        elif regra_sessao == RegraSessaoPublicaEnum.OPCIONAL:  # OPCIONAL
            mapping.append({
                "index": index,
                "required": False,
                "status": StatusTccEnum.PREVIA_OK,
                "mensagem": "Sua Sessão Pública de Andamento foi automaticamente considerada aprovada. Continue com o desenvolvimento do TCC.",
                "instrucoes": "Aguarde que seu Orientador confirme a execução da Sessão Pública de Andamento"
            })
        index += 1


    # Status referentes à sessão final
    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.FINAL_ORIENTADOR,
        "mensagem": "Você enviou os detalhes da Sessão Pública de Defesa para análise do Professor Orientador.",
        "instrucoes": "Você já pode agendar sua Sessão Pública de Defesa."
    })
    index += 1

    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.FINAL_COORDENADOR,
        "mensagem": "Os detalhes da Sessão Pública de Defesa estão sendo analisados pelo Coordenador do Curso.",
        "instrucoes": "Aguarde que o Orientador encaminhe o agendamento Sessão Pública de Defesa."
    })
    index += 1

    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.FINAL_AGENDADA,
        "mensagem": "A Sessão Pública de Defesa foi agendada. Fique atento à data e horário.",
        "instrucoes": "Aguarde que o Coordenador do Curso confirme o agendamento Sessão Pública de Defesa."
    })
    index += 1

    mapping.append({
        "index": index,
        "required": False,
        "status": StatusTccEnum.REPROVADO_FINAL,
        "mensagem": "Infelizmente, você reprovou na sessão final. O TCC foi encerrado.",
        "instrucoes": "Consulte seu orientador para discutir os próximos passos."
    })
    index += 1

    mapping.append({
        "index": index,
        "required": False,
        "status": StatusTccEnum.AJUSTE,
        "mensagem": "Seu TCC está em fase de ajustes solicitados pela banca. Realize as correções necessárias.",
        "instrucoes": "Realize os ajustes e solicite nova avaliação."
    })
    index += 1

    mapping.append({
        "index": index,
        "required": True,
        "status": StatusTccEnum.APROVADO,
        "mensagem": "Parabéns! Seu TCC foi aprovado e concluído com sucesso.",
        "instrucoes": "Aguarde o resultado da avaliação da banca."
    })

    return mapping
