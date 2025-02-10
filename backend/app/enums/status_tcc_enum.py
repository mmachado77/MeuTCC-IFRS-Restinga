from django.db import models

class StatusTccEnum(models.TextChoices):
    #ASSIM QUE CRIADO O TCC, ELE RECEBE ESSE STATUS. PROFESSOR PRECISA ACEITAR OU REPROVAR O CONVITE
    PROPOSTA_ANALISE_PROFESSOR = "PROPOSTA_ANALISE_PROFESSOR"

    PROPOSTA_RECUSADA_PROFESSOR = "PROPOSTA_RECUSADA_PROFESSOR" #REPROVA O TCC (FIM DE CICLO)

    #APÓS ACEITE DO PROFESSOR, O PROJETO É ENCAMINHADO PARA APRECIAÇÃO DO COORDENADOR DO CURO
    PROPOSTA_ANALISE_COORDENADOR = "PROPOSTA_ANALISE_COORDENADOR"

    PROPOSTA_RECUSADA_COORDENADOR = "PROPOSTA_RECUSADA_COORDENADOR" #REPROVA O TCC (FIM DE CICLO)

    #APÓS O COORDENADOR APROVAR O INÍCIO DO PROJETO, ELE FICA 'EM DESENVOLVIMENTO'. É O PERÍODO EM QUE O ALUNO EXECUTA O PROJETO
    DESENVOLVIMENTO = "DESENVOLVIMENTO"

    #A CRITÉRIO DO ALUNO E DO CALENDÁRIO ACADÊMICO, AUTOR ENCAMINHA DATA E COMPOSIÇÃO DA SESSÃO PRÉVIA
    #SERÁ OBRIGATÓRIA, OPCIONAL OU NÃO EXISTIRÁ, DE ACORDO COM AS REGRAS DO CURSO

    #A DATA E BANCA DA SESSÃO PRECISAM SER CONFIRMADAS PELO ORIENTADOR
    PREVIA_ORIENTADOR = "PREVIA_ORIENTADOR" 

    #A DATA E BANCA DA SESSÃO PRECISAM SER ACEITAS PELO COORDENADOR
    PREVIA_COORDENADOR = "PREVIA_COORDENADOR"

    #O TCC ESTACIONA NESSE STATUS ATÉ O DIA/HORA DA SESSÃO PRÉVIA
    PREVIA_AGENDADA = "PREVIA_AGENDADA" 

    #PROJETO PASSA OU REPROVA NA PRÉVIA (EXCLUSIVOS DE CURSOS QUE TÊM SESSÃO PRÉVIA OBRIGATÓRIA)
    REPROVADO_PREVIA = "REPROVADO_PREVIA" #REPROVA O TCC (FIM DE CICLO) EM CURSOS OBRIGATORIOS
    PREVIA_OK = "PREVIA_OK"  #CURSOS COM PRÉVIA OPCIONAL, RECEBEM ESSE STATUS AUTOMATICAMENTE APÓS O DIA DA SESSÃO

    ## PRÉVIA OK É O SEGUNDO STATUS DE 'DESENVOLVIMENTO'. ONDE O AUTOR VOLTA A EXECUTAR O PROJETO ATÉ QUE ESTEJA PRONTO
    ## PARA DEFENDER SEU PROJETO NA SESSÃO FINAL
    
    #A DATA E BANCA DA SESSÃO PRECISAM SER CONFIRMADAS PELO ORIENTADOR
    FINAL_ORIENTADOR = "FINAL_ORIENTADOR"

    #A DATA E BANCA DA SESSÃO PRECISAM SER ACEITAS PELO COORDENADOR
    FINAL_COORDENADOR = "FINAL_COORDENADOR"

    #O TCC ESTACIONA NESSE STATUS ATÉ O DIA/HORA DA SESSÃO FINAL
    FINAL_AGENDADA = "FINAL_AGENDADA"

    #PROJETO PASSA, REPROVA OU VAI PARA AJUSTE APÓS SESSÃO FINAL
    REPROVADO_FINAL = "REPROVADO_FINAL" #REPROVA O TCC (FIM DE CICLO)
    AJUSTE = "AJUSTE"   #UM STATUS EXTRA QUE SEMPRE É OPCIONAL, MAS PODE SER SOLICITADO PELA BANCA
                        #NA PRÁTICA, SIGNIFICA QUE A APROVAÇÃO DO PROJETO ESTÁ CONDICIONADA A QUE O AUTOR
                        #EXECUTE AJUSTES SOLICITADOS DENTRO DE UM PRAZO PREVISTO
    APROVADO = "APROVADO" #APROVA O TCC (FIM DE CICLO)

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
