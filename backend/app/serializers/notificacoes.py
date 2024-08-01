from rest_framework import serializers
from notifications.models import Notification

class NotificacaoSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Notification.
    """

    class Meta:
        model = Notification
        fields = '__all__'