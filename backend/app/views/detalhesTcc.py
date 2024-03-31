from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Tcc
from ..serializers import TccSerializer

class DetalhesTCCView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tccid, format=None):
        tcc = Tcc.objects.get(id=tccid)
        serializer = TccSerializer(tcc)
        return Response(serializer.data)
