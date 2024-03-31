from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max, F
from app.enums import StatusTccEnum
from app.models import Tcc, TccStatus, Usuario
from app.serializers import TccSerializer, TccStatusAlterarSerializer


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
    
class AtualizarTccStatus(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, tccId):
        usuario = Usuario.objects.get(user=request.user)
        serializer = TccStatusAlterarSerializer(data=request.data)

        if usuario.get_tipo == 'Professor Interno' and serializer.validated_data['status'] not in [StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR, StatusTccEnum.PROPOSTA_RECUSADA_ORIENTADOR]:
            return Response({'message': 'Você não tem permissão para atualizar o status para este valor!'}, status=403)
        elif usuario.get_tipo != 'Coordenador':
            return Response({'message': 'Você não tem permissão para atualizar o status do TCC!'}, status=403)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        TccStatus.objects.create(tcc_id=tccId, **serializer.validated_data)

        return Response({'message': 'Status atualizado com sucesso!'})
    
