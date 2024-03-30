from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import Professor
from app.serializers import UsuarioPolymorphicSerializer
from rest_framework.permissions import IsAuthenticated

class ProfessoresPendentesListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        professor = Professor.objects.filter(status__aprovacao=False)
        serializer = UsuarioPolymorphicSerializer(professor, many=True)
        return Response(serializer.data)