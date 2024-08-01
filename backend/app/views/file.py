import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from app.services.avaliacao import AvaliacaoService
from app.models import Tcc, Sessao, SessaoFinal, Avaliacao
from django.http import FileResponse
from meutcc.services import GoogleDriveService
from meutcc import settings
from app.models import Credenciais
from google.oauth2.credentials import Credentials

class UploadDocumentoTCCView(APIView):
    """
    API para upload de documentos do TCC.

    Métodos:
        post(request, tccId): Realiza o upload de um documento do TCC.
    """
    parser_classes = [MultiPartParser, FormParser]
    googleDriveService = GoogleDriveService()

    def post(self, request, tccId):
        """
        Realiza o upload de um documento do TCC.

        Args:
            request (Request): A requisição HTTP contendo o arquivo para upload.
            tccId (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP com o link do documento no Google Drive ou mensagem de erro.
        """
        try:
            tcc = Tcc.objects.get(id=tccId)
            file = request.FILES['file']
            file_path = os.path.join(settings.MEDIA_ROOT, 'tcc/documento', file.name)

            # Salvar o arquivo localmente
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            # Obter as credenciais do Google Drive
            credentials = Credenciais.objects.first()
            data = json.loads(credentials.access_token)
            creds = Credentials.from_authorized_user_info(data)

            # Fazer o upload para o Google Drive
            webViewLink = self.googleDriveService.upload_basic(creds, file_path, file.name)

            if webViewLink:
                # Salvar o link no banco de dados
                tcc.documentoTCC = webViewLink
                tcc.save()
                return Response({"link": webViewLink}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Erro ao fazer upload para o Google Drive"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadDocumentoSessaoView(APIView):
    """
    API para upload de documentos de sessões.

    Métodos:
        post(request, sessaoId): Realiza o upload de um documento de sessão.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, sessaoId):
        """
        Realiza o upload de um documento de sessão.

        Args:
            request (Request): A requisição HTTP contendo o arquivo para upload.
            sessaoId (int): ID da sessão.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            sessao.documentoTCCSessao = request.FILES['file']
            sessao.save()
            # Update the main document of TCC
            tcc = sessao.tcc
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadFichaAvaliacaoView(APIView):
    """
    API para upload de fichas de avaliação.

    Métodos:
        post(request, avaliacaoId): Realiza o upload de uma ficha de avaliação.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, avaliacaoId):
        """
        Realiza o upload de uma ficha de avaliação.

        Args:
            request (Request): A requisição HTTP contendo o arquivo para upload.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            avaliacao.ficha_avaliacao = request.FILES['file']
            avaliacao.save()
            return Response(status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadDocumentoAjusteView(APIView):
    """
    API para upload de documentos ajustados do TCC.

    Métodos:
        post(request, avaliacaoId): Realiza o upload de um documento ajustado do TCC.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, avaliacaoId):
        """
        Realiza o upload de um documento ajustado do TCC.

        Args:
            request (Request): A requisição HTTP contendo o arquivo para upload.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            avaliacao.tcc_definitivo = request.FILES['file']
            avaliacao.save()
            # Update the main document of TCC
            sessao = SessaoFinal.objects.get(avaliacao=avaliacao)
            tcc = sessao.tcc
            tcc.documentoTCC = request.FILES['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoTCCView(APIView):
    """
    API para exclusão de documentos do TCC.

    Métodos:
        delete(request, tccId): Exclui um documento do TCC.
    """
    def delete(self, request, tccId):
        """
        Exclui um documento do TCC.

        Args:
            request (Request): A requisição HTTP.
            tccId (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            tcc = Tcc.objects.get(id=tccId)
            if tcc.documentoTCC:
                tcc.documentoTCC.delete(save=True)
            tcc.documentoTCC = None
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoSessaoView(APIView):
    """
    API para exclusão de documentos de sessões.

    Métodos:
        delete(request, sessaoId): Exclui um documento de sessão.
    """
    def delete(self, request, sessaoId):
        """
        Exclui um documento de sessão.

        Args:
            request (Request): A requisição HTTP.
            sessaoId (int): ID da sessão.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                sessao.documentoTCCSessao.delete(save=True)
            sessao.documentoTCCSessao = None
            sessao.save()
            return Response(status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirFichaAvaliacaoView(APIView):
    """
    API para exclusão de fichas de avaliação.

    Métodos:
        delete(request, avaliacaoId): Exclui uma ficha de avaliação.
    """
    def delete(self, request, avaliacaoId):
        """
        Exclui uma ficha de avaliação.

        Args:
            request (Request): A requisição HTTP.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.ficha_avaliacao:
                avaliacao.ficha_avaliacao.delete(save=True)
            avaliacao.ficha_avaliacao = None
            avaliacao.save()
            return Response(status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoAjusteView(APIView):
    """
    API para exclusão de documentos ajustados do TCC.

    Métodos:
        delete(request, avaliacaoId): Exclui um documento ajustado do TCC.
    """
    def delete(self, request, avaliacaoId):
        """
        Exclui um documento ajustado do TCC.

        Args:
            request (Request): A requisição HTTP.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.tcc_definitivo:
                avaliacao.tcc_definitivo.delete(save=True)
            avaliacao.tcc_definitivo = None
            avaliacao.save()
            return Response(status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAutorizacaoPublicacaoView(APIView):
    """
    API para upload de autorização de publicação do TCC.

    Métodos:
        post(request, tccId): Realiza o upload da autorização de publicação do TCC.
    """
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, tccId, *args, **kwargs):
        """
        Realiza o upload da autorização de publicação do TCC.

        Args:
            request (Request): A requisição HTTP contendo o arquivo para upload.
            tccId (int): ID do TCC.

        Retorna:
            Response: Resposta HTTP com status de sucesso ou mensagem de erro.
        """
        try:
            tcc = Tcc.objects.get(id=tccId)
            tcc.autorizacaoPublicacao = request.data['file']
            tcc.save()
            return Response(status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
class DownloadDocumentoTCCView(APIView):
    """
    API para download de documentos do TCC.

    Métodos:
        get(request, tccId): Realiza o download de um documento do TCC.
    """
    def get(self, request, tccId):
        """
        Realiza o download de um documento do TCC.

        Args:
            request (Request): A requisição HTTP.
            tccId (int): ID do TCC.

        Retorna:
            FileResponse: Resposta HTTP com o arquivo para download ou mensagem de erro.
        """
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

class DownloadDocumentoSessaoView(APIView):
    """
    API para download de documentos de sessões.

    Métodos:
        get(request, sessaoId): Realiza o download de um documento de sessão.
    """
    def get(self, request, sessaoId):
        """
        Realiza o download de um documento de sessão.

        Args:
            request (Request): A requisição HTTP.
            sessaoId (int): ID da sessão.

        Retorna:
            FileResponse: Resposta HTTP com o arquivo para download ou mensagem de erro.
        """
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

class DownloadFichaAvaliacaoView(APIView):
    """
    API para download de fichas de avaliação.

    Métodos:
        get(request, avaliacaoId): Realiza o download de uma ficha de avaliação.
    """
    def get(self, request, avaliacaoId):
        """
        Realiza o download de uma ficha de avaliação.

        Args:
            request (Request): A requisição HTTP.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            FileResponse: Resposta HTTP com o arquivo para download ou mensagem de erro.
        """
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

class DownloadDocumentoAjusteView(APIView):
    """
    API para download de documentos ajustados do TCC.

    Métodos:
        get(request, avaliacaoId): Realiza o download de um documento ajustado do TCC.
    """

    def get(self, request, avaliacaoId):
        """
        Realiza o download de um documento ajustado do TCC.

        Args:
            request (Request): A requisição HTTP.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            FileResponse: Resposta HTTP com o arquivo para download ou mensagem de erro.
        """
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

class DownloadFichaAvaliacaoPreenchidaView(APIView):
    """
    API para download de fichas de avaliação preenchidas.

    Métodos:
        get(request, avaliacaoId): Realiza o download de uma ficha de avaliação preenchida.
    """
    avaliacaoService = AvaliacaoService()
    def get(self, request, avaliacaoId):
        """
        Realiza o download de uma ficha de avaliação preenchida.

        Args:
            request (Request): A requisição HTTP.
            avaliacaoId (int): ID da avaliação.

        Retorna:
            FileResponse: Resposta HTTP com o arquivo preenchido para download ou mensagem de erro.
        """
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            return self.avaliacaoService.preencherFichaAvaliacao(avaliacao)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

