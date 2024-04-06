from rest_framework import serializers
from ..models import Avaliacao
from ..serializers import FileSerializer

class AvaliacaoSerializer(serializers.ModelSerializer):
    ficha_avaliacao = FileSerializer()
    class Meta:
        model = Avaliacao
        fields = '__all__'