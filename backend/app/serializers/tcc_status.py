from rest_framework import serializers
from app.models import TccStatus
from app.enums import StatusTccEnum

class TccStatusSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo TccStatus.
    """

    class Meta:
        model = TccStatus
        fields = ['status', 'statusMensagem', 'dataStatus', 'justificativa']

class TccStatusResponderPropostaSerializer(serializers.Serializer):
    """
    Serializer para responder a uma proposta de TCC.

    Atributos:
        aprovar (BooleanField): Campo para indicar a aprovação da proposta.
        justificativa (CharField): Campo para fornecer uma justificativa, opcional se a proposta for aprovada.

    Métodos:
        validate_aprovar(value): Valida o campo aprovar e exige uma justificativa se a proposta não for aprovada.
    """
    aprovar = serializers.BooleanField()
    justificativa = serializers.CharField(required=False)

    def validate_aprovar(self, value):
        """
        Valida o campo aprovar e exige uma justificativa se a proposta não for aprovada.

        Args:
            value (bool): Valor do campo aprovar.

        Raises:
            serializers.ValidationError: Se a justificativa não for fornecida quando a proposta não é aprovada.
        """
        if not value:
            if 'justificativa' not in self.initial_data:
                raise serializers.ValidationError("Justificativa é obrigatória para este status")
        return value