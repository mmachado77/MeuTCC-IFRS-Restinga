from app.models import Usuario, TccStatus
from app.serializers import TccStatusResponderPropostaSerializer
from app.enums import UsuarioTipoEnum, StatusTccEnum
from app.services import TccService

class PropostaService:
    tccService = TccService()

    def responderProposta(self, tccId: int, usuario: Usuario, serializer: TccStatusResponderPropostaSerializer):
        tcc_status = TccStatus.objects.filter(tcc_id=tccId).latest('dataStatus')

        if usuario.tipo == UsuarioTipoEnum.COORDENADOR:
            if tcc_status.status != StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR:
                raise Exception('Você não tem permissão para responder esta proposta!')
            if not serializer.validated_data['aprovar']:
                return self.tccService.atualizarStatus(tccId, StatusTccEnum.PROPOSTA_RECUSADA_COORDENADOR, serializer.validated_data['justificativa'])
            return self.tccService.atualizarStatus(tccId, StatusTccEnum.DESENVOLVIMENTO)   
                         
        elif usuario.isProfessor():
            if tcc_status.status != StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR:
                raise Exception('Você não tem permissão para responder esta proposta!')
            if not serializer.validated_data['aprovar']:
                return self.tccService.atualizarStatus(tccId, StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR, serializer.validated_data['justificativa'])
            
            return self.tccService.atualizarStatus(tccId, StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR)
        
        raise Exception('Você não tem permissão para responder esta proposta!')