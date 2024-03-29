from rest_framework import generics
from rest_framework.response import Response
from ..models import ProfessorInterno, ProfessorExterno
from ..serializers import ProfessorInternoSerializer, ProfessorExternoSerializer

class ProfessorListAPIView(generics.ListAPIView):
    serializer_class = ProfessorInternoSerializer  # Para listar professores internos por padrão

    def get_queryset(self):
        return ProfessorInterno.objects.filter(status__aprovacao=False)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        data = serializer.data
        for item in data:
            item['tipoRegistro'] = 'Interno'

        return Response(data)

class ProfessorExternoListAPIView(ProfessorListAPIView):
    serializer_class = ProfessorExternoSerializer  # Para listar professores externos

    def get_queryset(self):
        return ProfessorExterno.objects.filter(status__aprovacao=False)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        data = serializer.data
        for item in data:
            item['tipoRegistro'] = 'Externo'

        return Response(data)
