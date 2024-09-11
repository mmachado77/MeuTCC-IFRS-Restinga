from app.models import TccStatus
from app.enums import StatusTccEnum
from app.models.semestre import Semestre
from app.models.tcc import Tcc
from django.db.models import Max, F

class TccService:
    """
    Serviço para gerenciar TCCs (Trabalhos de Conclusão de Curso).

    Métodos:
        atualizarStatus(tccId, status, justificativa=None): Atualiza o status de um TCC.
        criarTcc(usuario, serializer): Cria um novo TCC.
        possuiProposta(usuario): Verifica se o usuário já possui uma proposta de TCC.
    """

    def atualizarStatus(self, tccId, status, justificativa=None):
        """
        Atualiza o status de um TCC.

        Args:
            tccId (int): ID do TCC.
            status (str): Novo status do TCC.
            justificativa (str, opcional): Justificativa para a atualização de status.

        Raises:
            Exception: Se a justificativa for obrigatória para o status e não for fornecida.
        """
        status_enum = StatusTccEnum(status)

        if status_enum.justificativa_obrigatoria() and not justificativa:
            raise Exception('Justificativa é obrigatória para este status')
        
        TccStatus.objects.create(tcc_id=tccId, status=status, justificativa=justificativa)

        return True
    
    def criarTcc(self, usuario, serializer):
        """
        Cria um novo TCC.

        Args:
            usuario (Usuario): O autor do TCC.
            serializer (Serializer): Serializer contendo os dados validados para criar o TCC.

        Raises:
            Exception: Se o usuário já possuir uma proposta de TCC.
        """
        
        if(self.possuiProposta(usuario)):
            raise Exception('Usuário já possui uma proposta de TCC')
        
        semestreAtual = Semestre.objects.latest('id')
        tcc = Tcc.objects.create(autor = usuario, semestre = semestreAtual, **serializer.validated_data)
 
        TccStatus.objects.create(tcc=tcc, status=StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR)

    def possuiProposta(self, usuario):
        """
        Verifica se o usuário já possui uma proposta de TCC.

        Args:
            usuario (Usuario): O usuário a ser verificado.
        """
        tccs = Tcc.objects.filter(autor=usuario)
        if(tccs.exists()):
            tccsCancelados = tccs.all().annotate(max_id=Max('tccstatus__id')).filter(
            tccstatus__id=F('max_id'), 
            tccstatus__status__in=StatusTccEnum.statusTccCancelado())
           
            if tccsCancelados.count() == tccs.count():
                return False
            else:
                return True
            
        return False 

    


