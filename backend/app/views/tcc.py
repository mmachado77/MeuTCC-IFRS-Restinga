from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Max, F
from app.enums import StatusTccEnum
from app.models import Tcc, TccStatus, Usuario, Estudante, Semestre
from app.serializers import TccSerializer, TccStatusAlterarSerializer, TccCreateSerializer



class ListarTccPendente(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        if usuario.get_tipo == 'Coordenador': 
            filtrar_status = StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR
        elif usuario.get_tipo == 'Professor Interno':
            filtrar_status = StatusTccEnum.PROPOSTA_ANALISE_ORIENTADOR

        tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(tccstatus__id=F('max_id'), tccstatus__status=filtrar_status)
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    
class MeusTCCs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        tccs = Tcc.objects.filter(autor = usuario)
        
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    
class AtualizarTccStatus(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tccId):
        usuario = Usuario.objects.get(user=request.user)
        serializer = TccStatusAlterarSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
 
        if usuario.get_tipo == 'Professor Interno': 
            if serializer.validated_data['status'] not in [StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR, StatusTccEnum.PROPOSTA_RECUSADA_ORIENTADOR]:
                return Response({'message': 'Você não tem permissão para atualizar o status para este valor!'}, status=403)
        elif usuario.get_tipo != 'Coordenador':
            return Response({'message': 'Você não tem permissão para atualizar o status do TCC!'}, status=403)
        
        TccStatus.objects.create(tcc_id=tccId, **serializer.validated_data)

        return Response({'message': 'Status atualizado com sucesso!'})
    
class CriarTCCView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            usuario = Estudante.objects.get(user=request.user)
            serializer = TccCreateSerializer(data=request.data)

            # Pega o ultimo semestre cadastrado
            semestreAtual = Semestre.objects.latest('id')

            if not serializer.is_valid():
                print (serializer.errors)
                return Response(serializer.errors, status=400)
                
            Tcc.objects.create(autor = usuario, semestre = semestreAtual, **serializer.validated_data)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Estudante.DoesNotExist:
            return Response({'message': 'Usuário não é um estudante!'}, status=403)
        
