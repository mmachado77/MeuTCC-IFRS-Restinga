from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Max, F, Q
from app.enums import StatusTccEnum, UsuarioTipoEnum
from app.models import Tcc, TccStatus, Usuario, Estudante, Semestre, Professor, Coordenador
from app.serializers import TccSerializer, TccCreateSerializer, TccStatusResponderPropostaSerializer
from app.services.proposta import PropostaService
from app.models.convite import Convite
from app.services.tcc import TccService

class ListarTccPendente(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        semestreAtual = Semestre.objects.latest('id')
        tccs = None
        if usuario.tipo == UsuarioTipoEnum.COORDENADOR: 
            tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(
                tccstatus__id=F('max_id'), 
                semestre=semestreAtual, 
                tccstatus__status=StatusTccEnum.PROPOSTA_ANALISE_COORDENADOR)
        elif usuario.isProfessor():
            tccs = Tcc.objects.all().annotate(max_id=Max('tccstatus__id')).filter(
                Q(orientador=usuario) | Q(coorientador=usuario),
                tccstatus__id=F('max_id'), 
                semestre=semestreAtual,
                tccstatus__status=StatusTccEnum.PROPOSTA_ANALISE_PROFESSOR
            )

        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    
class TCCs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
     
        tccs = Tcc.objects.all()
        serializer = TccSerializer(tccs, many=True)
        
        return Response(serializer.data)
    
class TCCsByAluno(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        tccs = Tcc.objects.filter(autor = usuario)
        
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    

class TCCsByOrientador(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Usuario.objects.get(user=request.user)
        
        tccs = Tcc.objects.filter(Q(orientador=usuario) | Q(coorientador=usuario))
        
        serializer = TccSerializer(tccs, many=True)
        return Response(serializer.data)
    
class PossuiProposta(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = Estudante.objects.get(user=request.user)
        possuiProposta = TccService().possuiProposta(usuario)
        
        return Response({'possuiProposta': possuiProposta})
        
class CriarTCCView(APIView):
    permission_classes = [IsAuthenticated]
    tccService = TccService()

    def post(self, request):
        
        # Validar "afirmo que conversei com o orientador e coorientador sobre o tema do TCC."
        try:
            usuario = Estudante.objects.get(user=request.user)
            serializer = TccCreateSerializer(data=request.data)

            if not serializer.is_valid():
                print (serializer.errors)
                return Response(serializer.errors, status=400) 
            
            if not request.data.get('afirmoQueConversei'):
                return Response({'message': 'Você deve afirmar que conversou com o orientador e coorientador sobre o tema do TCC.'}, status=400) 
                
            self.tccService.criarTcc(usuario, serializer)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Estudante.DoesNotExist:
            return Response({'message': 'Usuário não é um estudante!'}, status=403)
        except Exception as e:
            return Response({'message': str(e)}, status=400)
        

class TccStatusResponderPropostaView(APIView):
    permission_classes = [IsAuthenticated]
    propostaService = PropostaService()

    def post(self, request, tccId):
        serializer = TccStatusResponderPropostaSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        usuario = Usuario.objects.get(user=request.user)

        self.propostaService.responderProposta(tccId, usuario, serializer)
        
        return Response({'message': 'Status atualizado com sucesso!'})


class EditarTCCView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, tccid):
        try:
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if user == tcc.autor.user:
            tcc.tema = request.data.get('tema', tcc.tema)
            tcc.resumo = request.data.get('resumo', tcc.resumo)
            tcc.save()
            return Response({'message': 'TCC atualizado com sucesso.'})

        if user.is_superuser or Coordenador.objects.filter(user=user).exists():
            tcc.orientador = Professor.objects.get(id=request.data.get('orientador', tcc.orientador))
            if request.data.get('coorientador', tcc.coorientador) is not None:
                tcc.coorientador = Professor.objects.get(id=request.data.get('coorientador', tcc.coorientador))
            tcc.save()
            return Response({'message': 'TCC atualizado com sucesso.'})

        # Se o usuário não tiver permissão
        return Response({"error": "Você não tem permissão para editar este TCC."}, status=status.HTTP_403_FORBIDDEN)


class DetalhesTCCView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tccid, format=None):
        try:
            tcc = Tcc.objects.get(id=tccid)
        except Tcc.DoesNotExist:
            return Response({"error": "TCC não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        coord = Coordenador.objects.filter(user=user)
        if (str(user) == 'admin') or (user == tcc.autor.user) or (user == tcc.orientador.user) or (
                tcc.coorientador and user == tcc.coorientador.user) or (coord.exists()):
            serializer = TccSerializer(tcc)
            return Response(serializer.data)
        else:
            return Response({"error": "Você não tem permissão para visualizar este TCC."},
                            status=status.HTTP_403_FORBIDDEN)


    

    