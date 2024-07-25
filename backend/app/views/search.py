import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.models import Tcc, Usuario
from app.serializers import UsuarioSerializer, TccSerializer

logger = logging.getLogger(__name__)

class SearchView(APIView):
    def get(self, request, format=None):
        logger.info("SearchView accessed")  # Log to verify if the view is being accessed
        query = request.GET.get('q', '')
        if query:
            users = Usuario.objects.filter(nome__icontains=query)
            tccs = Tcc.objects.filter(tema__icontains=query)
            user_data = UsuarioSerializer(users, many=True).data
            tcc_data = TccSerializer(tccs, many=True).data
            suggestions = [
                {"label": user['nome'], "type": "user", "id": user['id']} for user in user_data
            ] + [
                {"label": tcc['tema'], "type": "tcc", "id": tcc['id'], "autor": tcc['autor']['nome'], "orientador": tcc['orientador']['nome']} for tcc in tcc_data
            ]
            return Response(suggestions, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)
