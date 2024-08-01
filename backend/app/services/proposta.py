from app.models import Usuario, TccStatus
from app.serializers import TccStatusResponderPropostaSerializer
from app.enums import UsuarioTipoEnum, StatusTccEnum
from app.services import TccService

class PropostaService:
    """
    Serviço para lidar com respostas a propostas de TCC.

    Atributos:
        tccService (TccService): Instância do serviço de TCC.

    Métodos:
        responderProposta(tccId, usuario, serializer): Responde a uma proposta de TCC com base no tipo de usuário e no status atual.
    """
    tccService = TccService()

    def responderProposta(self, tccId: int, usuario: Usuario, serializer: TccStatusResponderPropostaSerializer):
        """
        Responde a uma proposta de TCC com base no tipo de usuário e no status atual.

        Args:
            tccId (int): ID do TCC.
            usuario (Usuario): O usuário que está respondendo à proposta.
            serializer (TccStatusResponderPropostaSerializer): Serializer contendo os dados validados da resposta.

        Raises:
            Exception: Se o usuário não tiver permissão para responder à proposta ou se o status atual não permitir a resposta.
        """
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