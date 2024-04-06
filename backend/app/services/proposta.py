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
                self.responderConvite(tccId, usuario, serializer.validated_data['aprovar'], serializer.validated_data['justificativa'])
                return self.tccService.atualizarStatus(tccId, StatusTccEnum.PROPOSTA_RECUSADA_PROFESSOR, serializer.validated_data['justificativa'])
            
            self.responderConvite(tccId, usuario, serializer.validated_data['aprovar'])

            if self.isTodosConvitesAprovados(tccId):
                return self.tccService.atualizarStatus(tccId, StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR)
            
            return True
        
        raise Exception('Você não tem permissão para responder esta proposta!')        

    # TODO: Implementar model Convite, após implementação do model Convite, descomentar o código abaixo e apagar a linha de retorno
    def responderConvite(self, tccId: int, usuario: Usuario, aprovar: bool, justificativa: str = None):
        # convite = Convite.objects.get(tcc_id=tccId, professor=usuario)

        # if not convite:
        #     raise Exception('Você não foi convidado para orientar este TCC!')
        
        # convite.aprovado = aprovar
        # convite.justificativa = justificativa
        # convite.save()

        return True

    # TODO: Implementar model Convite, após implementação do model Convite, descomentar o código abaixo e apagar a linha de retorno
    def isTodosConvitesAprovados(self, tccId: int):
        # convites = Convite.objects.filter(tcc_id=tccId)
        # return all([convite.aprovado for convite in convites])
        return True

