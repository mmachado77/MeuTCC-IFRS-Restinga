from rest_framework import serializers
from ..models import StatusTCC

class StatusTccSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusTCC
        fields = ['status', 'dataStatus']