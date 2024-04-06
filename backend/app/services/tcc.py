from app.models import TccStatus
from app.enums import StatusTccEnum

class TccService:

    def atualizarStatus(self, tccId, status, justificativa=None):
        status_enum = StatusTccEnum(status)

        if status_enum.justificativa_obrigatoria() and not justificativa:
            raise Exception('Justificativa é obrigatória para este status')
        
        TccStatus.objects.create(tcc_id=tccId, status=status, justificativa=justificativa)

        return True

