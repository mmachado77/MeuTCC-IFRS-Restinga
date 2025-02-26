from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from app.models import ProfessorInterno, ProfessorExterno, Curso, Coordenador
from app.serializers import ProfessorInternoSerializer, ProfessorExternoSerializer
from app.permissions import IsSuperAdmin
from .custom_api_view import CustomAPIView

class ListaProfessoresInternosView(CustomAPIView):
    """
    Lista todos os professores internos pendentes de aprovação.
    Acesso restrito ao SUPERADMIN.
    """
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        professores = ProfessorInterno.objects.filter(status__aprovacao=False)
        serializer = ProfessorInternoSerializer(professores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AprovarProfessorInternoView(CustomAPIView):
    """
    Aprova um professor interno.
    Acesso restrito ao SUPERADMIN.
    """
    permission_classes = [IsSuperAdmin]

    def put(self, request, pk):
        professor = get_object_or_404(ProfessorInterno, id=pk, status__aprovacao=False)
        professor.status.aprovacao = True
        professor.status.justificativa = None  # Resetar a justificativa caso tenha sido recusado anteriormente
        professor.status.save()
        return Response({"detail": "Professor aprovado com sucesso."}, status=status.HTTP_200_OK)

class RecusarProfessorInternoView(CustomAPIView):
    """
    Recusa um professor interno pendente.
    Acesso restrito ao SUPERADMIN.
    """
    permission_classes = [IsSuperAdmin]

    def put(self, request, pk):
        professor = get_object_or_404(ProfessorInterno, id=pk, status__aprovacao=False)
        professor.status.aprovacao = False
        professor.status.justificativa = request.data.get("justificativa", "Sem justificativa.")
        professor.status.save()
        return Response({"detail": "Professor recusado com justificativa."}, status=status.HTTP_200_OK)

class ListaProfessoresExternosView(CustomAPIView):
    """
    Lista professores externos pendentes de aprovação apenas do curso do coordenador logado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        coordCurso = get_object_or_404(Coordenador, user=request.user)
        curso = get_object_or_404(Curso, pk=coordCurso.curso.id)

        professores = ProfessorExterno.objects.filter(
            curso=curso,
            status__aprovacao=False
        )

        serializer = ProfessorExternoSerializer(professores, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AprovarProfessorExternoView(CustomAPIView):
    """
    Aprova um professor externo e o adiciona automaticamente ao curso do coordenador logado.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        coordCurso = get_object_or_404(Coordenador, user=request.user)
        curso = get_object_or_404(Curso, pk=coordCurso.curso.id)
        professor = get_object_or_404(ProfessorExterno, id=pk, curso=curso, status__aprovacao=False)

        professor.status.aprovacao = True
        professor.status.justificativa = None
        professor.status.save()

        curso.professores.add(professor)
        curso.save()

        return Response({"detail": "Professor externo aprovado e adicionado ao curso."}, status=status.HTTP_200_OK)

class RecusarProfessorExternoView(CustomAPIView):
    """
    Recusa um professor externo pendente, sem removê-lo do sistema.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        coordCurso = get_object_or_404(Coordenador, user=request.user)
        curso = get_object_or_404(Curso, pk=coordCurso.curso.id)
        professor = get_object_or_404(ProfessorExterno, id=pk, curso=curso, status__aprovacao=False)

        professor.status.aprovacao = False
        professor.status.justificativa = request.data.get("justificativa", "Sem justificativa.")
        professor.status.save()

        return Response({"detail": "Professor externo recusado com justificativa."}, status=status.HTTP_200_OK)
