from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from django.db.models import Q
from rest_framework import status
from datetime import datetime, date
from ..models import Banca, Sessao, SessaoPrevia, SessaoFinal, Tcc, Usuario
from ..serializers import SessaoFuturaSerializer
from rest_framework.permissions import IsAuthenticated
from app.services.notificacoes import notificacaoService
from app.services.tcc import TccService
from datetime import date, datetime, time, timedelta
from dateutil.parser import parse
from app.enums import StatusTccEnum

class SessoesFuturasView(CustomAPIView):
    """
    API para listar todas as sessões futuras.

    Métodos:
        get(request): Retorna todas as sessões futuras.
    """
    def get(self, request):
        """
        Retorna todas as sessões futuras.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com as sessões futuras ou mensagem de erro.
        """
        sessoes = Sessao.objects.filter(
                data_inicio__gt=datetime.now(),
                validacaoOrientador=True
            )
    
        sessoes_serializer = SessaoFuturaSerializer(sessoes, many=True).data
        return Response(sessoes_serializer, status=status.HTTP_200_OK)
    
class SessoesFuturasOrientadorView(CustomAPIView):
    """
    API para listar todas as sessões futuras de um orientador.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        get(request): Retorna todas as sessões futuras do orientador.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna todas as sessões futuras do orientador.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP com as sessões futuras do orientador ou mensagem de erro.
        """
        try:
            usuario = Usuario.objects.get(user=request.user)
            tccs_do_orientador = Tcc.objects.filter(orientador=usuario)

            # Filtra as sessões futuras dos TCCs do orientador
            sessoes = Sessao.objects.filter(
                tcc__in=tccs_do_orientador,
                data_inicio__gt=datetime.now(),
            )
            
            serializer = SessaoFuturaSerializer(sessoes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
    
class SessaoEditView(CustomAPIView):
    """
    API para editar uma sessão.

    Métodos:
        put(request): Edita uma sessão.
    """
    notificacaoService = notificacaoService()
    tccService = TccService()
    def put(self, request):
        """
        Edita uma sessão.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a edição ou mensagem de erro.
        """
        try:
            data = request.data
            id_sessao = data.get('idSessao')
            sessao_atualizada = Sessao.objects.get(pk=id_sessao)
            tipo = sessao_atualizada.get_tipo
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
            sessao_atualizada.data_agendamento = datetime.now()
            self.notificacaoService.enviarNotificacaoAgendamentoBanca(request.user, sessao_atualizada, banca_atualizada)
            sessao_atualizada.save()

            if tipo == 'Sessão Prévia':
                self.tccService.atualizarStatus(sessao_atualizada.tcc.id, StatusTccEnum.PREVIA_AGENDADA)
            elif tipo == 'Sessão Final':
                self.tccService.atualizarStatus(sessao_atualizada.tcc.id, StatusTccEnum.FINAL_AGENDADA)

        except Sessao.DoesNotExist:
            return Response({'status': 'error', 'message': "Sessão não encontrada"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'status': 'success', 'message': "Sessão atualizada com sucesso"}, status=status.HTTP_200_OK)
    
class SessaoEditOrientadorView(CustomAPIView):
    """
    API para editar uma sessão pelo orientador.

    Métodos:
        put(request): Edita uma sessão pelo orientador.
    """
    tccService = TccService()
    def put(self, request):
        """
        Edita uma sessão pelo orientador.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a edição ou mensagem de erro.
        """
        try:
            data = request.data
            id_sessao = data.get('idSessao')
            sessao_atualizada = Sessao.objects.get(pk=id_sessao)
            tipo = sessao_atualizada.get_tipo
            banca_atualizada = Banca.objects.filter(sessao=sessao_atualizada).first()
            if not banca_atualizada:
                return Response({'status': 'error', 'message': "Banca não encontrada para esta sessão"}, status=status.HTTP_400_BAD_REQUEST)
            
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
            sessao_atualizada.validacaoOrientador = True
            sessao_atualizada.save()

            if tipo == 'Sessão Prévia':
                self.tccService.atualizarStatus(sessao_atualizada.tcc.id, StatusTccEnum.PREVIA_COORDENADOR)
            elif tipo == 'Sessão Final':
                self.tccService.atualizarStatus(sessao_atualizada.tcc.id, StatusTccEnum.FINAL_COORDENADOR)

        except Sessao.DoesNotExist:
            return Response({'status': 'error', 'message': "Sessão não encontrada"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'status': 'success', 'message': "Sessão atualizada com sucesso"}, status=status.HTTP_200_OK)

class SessaoCreateView(CustomAPIView):
    """
    API para criar uma nova sessão.

    Métodos:
        post(request): Cria uma nova sessão.
    """
    notificacaoService = notificacaoService()
    tccService = TccService()

    def post(self, request):
        """
        Cria uma nova sessão.

        Args:
            request (Request): A requisição HTTP.

        Retorna:
            Response: Resposta HTTP confirmando a criação ou mensagem de erro.
        """
        try:
            data = request.data

            tcc = data['idTCC']

            if data['tipo'] == 'previa' and SessaoPrevia.objects.filter(tcc__id=tcc).exists():
                return Response("Já existe uma sessão de prévia para este TCC", status=status.HTTP_400_BAD_REQUEST)
            
            if data['tipo'] == 'final' and SessaoFinal.objects.filter(tcc__id=tcc).exists():
                return Response("Já existe uma sessão final para este TCC", status=status.HTTP_400_BAD_REQUEST)

            dataInicio = parse(data['dataInicio'])
            local = data['localDescricao']
            formaApresentacao = data['localForma']
            prazoEntregaDocumento = dataInicio + timedelta(days=14)
            avaliador1 = data['avaliador1']
            avaliador2 = data['avaliador2']
            tccInstance = Tcc.objects.get(pk=tcc)

            sessao = None
            if data['tipo'] == 'previa':
                sessao = SessaoPrevia.objects.create(
                    data_inicio = dataInicio,
                    local = local,
                    forma_apresentacao = formaApresentacao,
                    prazoEntregaDocumento = prazoEntregaDocumento,
                    tcc = tccInstance
                )
                self.tccService.atualizarStatus(tcc, StatusTccEnum.PREVIA_ORIENTADOR)
            elif data['tipo'] == 'final':
                sessao = SessaoFinal.objects.create(
                    data_inicio = dataInicio,
                    local = local,
                    forma_apresentacao = formaApresentacao,
                    prazoEntregaDocumento = prazoEntregaDocumento,
                    tcc = tccInstance
                )
                self.tccService.atualizarStatus(tcc, StatusTccEnum.FINAL_ORIENTADOR)

            banca = Banca.objects.create(
                sessao=sessao,
            )

            banca.professores.set([avaliador1, avaliador2])

            self.notificacaoService.enviarNotificacaoAgendamentoBanca(request.user, sessao, banca)

            return Response({'status': 'success', 'message': "Sessão criada com sucesso"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

class AvaliarPreviaView(CustomAPIView):
    permission_classes = [IsAuthenticated]
    tccService = TccService()
    def post(self, request, sessaoId):
        try:
            sessao = SessaoPrevia.objects.get(id=sessaoId)
            banca = Banca.objects.get(sessao=sessao)
            orientador = sessao.tcc.orientador
            user = request.user
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user == orientador.user:
            if sessao.avaliado:
                return Response({'status': 'error', 'message': "Você já avaliou esta sessão."},status=status.HTTP_400_BAD_REQUEST)
            else:
                sessao.parecer_orientador = request.data.get('parecer_orientador')
                if request.data.get('resultado_previa') == 'true':
                    self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.PREVIA_OK)
                else:
                    self.tccService.atualizarStatus(sessao.tcc.id, StatusTccEnum.REPROVADO_PREVIA, request.data.get('parecer_orientador'))
                sessao.avaliado = True;
        elif user == banca.professores.all()[0].user:
            sessao.comentarios_avaliador1 = request.data.get('comentarios_adicionais')
        elif user == banca.professores.all()[1].user:
                sessao.comentarios_avaliador2 = request.data.get('comentarios_adicionais')
        else:
            return Response({'status': 'error', 'message': "Você não tem permissão para avaliar esta sessão prévia."}, status=status.HTTP_403_FORBIDDEN)

        sessao.save()
        return Response({'status': 'success', 'message': 'Avaliação cadastrada com sucesso.'}, status=status.HTTP_201_CREATED)