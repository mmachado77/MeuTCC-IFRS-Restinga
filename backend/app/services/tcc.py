from app.models import TccStatus
from app.enums import StatusTccEnum
from app.models.convite import Convite
from app.models.semestre import Semestre
from app.models.tcc import Tcc
from django.db.models import Max, F

class TccService:

    def atualizarStatus(self, tccId, status, justificativa=None):
        status_enum = StatusTccEnum(status)

        if status_enum.justificativa_obrigatoria() and not justificativa:
            raise Exception('Justificativa é obrigatória para este status')
        
        TccStatus.objects.create(tcc_id=tccId, status=status, justificativa=justificativa)

        return True
    
    def criarTcc(self, usuario, serializer):
        semestreAtual = Semestre.objects.latest('id')
        tcc = Tcc.objects.create(autor = usuario, semestre = semestreAtual, **serializer.validated_data)

        Convite.objects.create(tcc=tcc, professor=tcc.orientador)
            
        if tcc.coorientador:
            Convite.objects.create(tcc=tcc, professor=tcc.coorientador)

        TccStatus.objects.create(tcc=tcc, status=StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR)

    def possuiProposta(self, usuario):
        tccs = Tcc.objects.filter(autor=usuario)
        if(tccs.exists()):
            tccsCancelados = tccs.all().annotate(max_id=Max('tccstatus__id')).filter(
            tccstatus__id=F('max_id'), 
            tccstatus__status__in=StatusTccEnum.statusTccCancelado())
           
            if tccsCancelados.count() == tccs.count():
                return True
            else:
                return False
            
        return True 

    


