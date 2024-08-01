from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from app.services.avaliacao import AvaliacaoService
from app.models import Tcc, Sessao, SessaoFinal, Avaliacao
from django.http import FileResponse
class UploadDocumentoTCCView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class UploadDocumentoSessaoView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            sessao.documentoTCCSessao = request.FILES['file']
            sessao.save()
            # Update the main document of TCC
            tcc = sessao.tcc
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadFichaAvaliacaoView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            avaliacao.ficha_avaliacao = request.FILES['file']
            avaliacao.save()
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadDocumentoAjusteView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            avaliacao.tcc_definitivo = request.FILES['file']
            avaliacao.save()
            # Update the main document of TCC
            sessao = SessaoFinal.objects.get(avaliacao=avaliacao)
            tcc = sessao.tcc
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoTCCView(CustomAPIView):
    def delete(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            if tcc.documentoTCC:
                tcc.documentoTCC.delete(save=True)
            tcc.documentoTCC = None
            tcc.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoSessaoView(CustomAPIView):
    def delete(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                sessao.documentoTCCSessao.delete(save=True)
            sessao.documentoTCCSessao = None
            sessao.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirFichaAvaliacaoView(CustomAPIView):
    def delete(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.ficha_avaliacao:
                avaliacao.ficha_avaliacao.delete(save=True)
            avaliacao.ficha_avaliacao = None
            avaliacao.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoAjusteView(CustomAPIView):
    def delete(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.tcc_definitivo:
                avaliacao.tcc_definitivo.delete(save=True)
            avaliacao.tcc_definitivo = None
            avaliacao.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAutorizacaoPublicacaoView(CustomAPIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, tccId, *args, **kwargs):
        try:
            tcc = Tcc.objects.get(id=tccId)
            tcc.autorizacaoPublicacao = request.data['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
class DownloadDocumentoTCCView(CustomAPIView):
    def get(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            if tcc.documentoTCC:
                response = FileResponse(tcc.documentoTCC, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{tcc.documentoTCC.name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DownloadDocumentoSessaoView(CustomAPIView):
    def get(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                response = FileResponse(sessao.documentoTCCSessao, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{sessao.documentoTCCSessao.name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DownloadFichaAvaliacaoView(CustomAPIView):
    def get(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.ficha_avaliacao:
                response = FileResponse(avaliacao.ficha_avaliacao, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{avaliacao.ficha_avaliacao.name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DownloadDocumentoAjusteView(CustomAPIView):
    def get(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.tcc_definitivo:
                response = FileResponse(avaliacao.tcc_definitivo, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{avaliacao.tcc_definitivo.name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DownloadFichaAvaliacaoPreenchidaView(CustomAPIView):
    avaliacaoService = AvaliacaoService()
    def get(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            return self.avaliacaoService.preencherFichaAvaliacao(avaliacao)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

