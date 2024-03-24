from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models.professor import Professor
from .models.tcc import Tcc
from .serializers import ProfessorSerializer
from .serializers import TccSerializer

# Create your views here.

class GetProfessores(generics.ListCreateAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class CriarTCView(APIView):
    def post(self, request):
        serializer = TccSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)