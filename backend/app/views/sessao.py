from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Banca, Sessao
from ..serializers import SessaoFuturaSerializer
from rest_framework.permissions import IsAuthenticated

class SessoesFuturasView(APIView):
    def get(self, request):
        sessoes = Sessao.getSessoesFuturas()
    
        sessoes_serializer = SessaoFuturaSerializer(sessoes, many=True).data
        return Response(sessoes_serializer, status=status.HTTP_200_OK)