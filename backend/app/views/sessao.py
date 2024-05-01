from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Banca, Sessao
from ..serializers import SessaoFuturaSerializer
from rest_framework.permissions import IsAuthenticated

class SessoesFuturasView(APIView):
    def get(self, request):
        sessoes = Sessao.getSessoesFuturas()
    
        sessoes_serializer = SessaoFuturaSerializer(sessoes, many=True).data
        return Response(sessoes_serializer, status=status.HTTP_200_OK)
    
class SessaoEditView(APIView):
    def put(self, request):
        try:
            data = request.data
            id_sessao = data.get('idSessao')
            sessao_atualizada = Sessao.objects.get(pk=id_sessao)
            banca_atualizada = Banca.objects.filter(sessao=sessao_atualizada).first()
            if not banca_atualizada:
                return Response("Banca não encontrada para esta sessão", status=status.HTTP_400_BAD_REQUEST)
            
            professores_atualizados = []
            if 'avaliador1' in data:
                professores_atualizados.append(data['avaliador1'])
            if 'avaliador2' in data:
                professores_atualizados.append(data['avaliador2'])
            banca_atualizada.professores.set(professores_atualizados)
            
            if 'local' in data:
                sessao_atualizada.local = data['local']
            if 'dataInicio' in data:
                sessao_atualizada.data_inicio = data['dataInicio']
            sessao_atualizada.validacaoCoordenador = True
            sessao_atualizada.save()

        except Sessao.DoesNotExist:
            return Response("Sessão não encontrada", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        return Response("Sessão atualizada com sucesso", status=status.HTTP_200_OK)
