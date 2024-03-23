from django.shortcuts import render
from rest_framework import generics
from .models.professor import Professor
from .serializers import ProfessorSerializer

# Create your views here.

class GetProfessores(generics.ListCreateAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer