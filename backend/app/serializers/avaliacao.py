from rest_framework import serializers
from ..models import Avaliacao
from ..serializers import FileDetailSerializer

class AvaliacaoSerializer(serializers.ModelSerializer):
    ficha_avaliacao = FileDetailSerializer()
    class Meta:
        model = Avaliacao
        fields = '__all__'