from .custom_api_view import CustomAPIView
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from app.services.avaliacao import AvaliacaoService
from app.models import Tcc, Sessao, SessaoFinal, Avaliacao
from django.http import FileResponse
import datetime
from meutcc.services import GoogleDriveService
from meutcc import settings
from app.models import Credenciais
from google.oauth2.credentials import Credentials

class UploadDocumentoTCCView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]
    googleDriveService = GoogleDriveService()

    def post(self, request, tccId):
        try:
            tcc = Tcc.objects.get(id=tccId)
            # Realiza o upload para o Google Drive e obtém o file id
            file_id = self.googleDriveService.upload_file(request.FILES['file'])
            if file_id is None:
                return Response({"error": "Falha no upload para o Google Drive"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Extrai os metadados do arquivo recebido
            file_name = request.FILES['file'].name
            file_size = request.FILES['file'].size
            
            # Armazena os metadados como JSON no campo do TCC
            file_metadata = {
                "id": file_id,
                "name": file_name,
                "size": file_size,
                "dataModificacao": datetime.datetime.now().isoformat()
            }
            tcc.documentoTCC = json.dumps(file_metadata)
            tcc.save()
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class UploadDocumentoSessaoView(CustomAPIView):
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
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadFichaAvaliacaoView(CustomAPIView):
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
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadDocumentoAjusteView(CustomAPIView):
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
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoTCCView(CustomAPIView):
    googleDriveService = GoogleDriveService()
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
                self.googleDriveService.delete_file(tcc.documentoTCC)
                # tcc.documentoTCC.delete(save=True)
            tcc.documentoTCC = None
            tcc.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoSessaoView(CustomAPIView):
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
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirFichaAvaliacaoView(CustomAPIView):
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
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ExcluirDocumentoAjusteView(CustomAPIView):
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
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadAutorizacaoPublicacaoView(CustomAPIView):
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
        
class DownloadDocumentoTCCView(CustomAPIView):
    """
    API para download de documentos do TCC.

    Métodos:
        get(request, tccId): Realiza o download de um documento do TCC.
    """
    
    googleDriveService = GoogleDriveService()
    
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
                # Extrai o ID do documento a partir do JSON armazenado
                document_info = json.loads(tcc.documentoTCC)
                file_id = document_info.get("id")
                if not file_id:
                    raise Exception("ID do documento não encontrado")
                content, file_name = self.googleDriveService.download_file(file_id)
                response = FileResponse(content, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class DownloadDocumentoSessaoView(CustomAPIView):
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

class DownloadFichaAvaliacaoView(CustomAPIView):
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

class DownloadDocumentoAjusteView(CustomAPIView):
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

class DownloadFichaAvaliacaoPreenchidaView(CustomAPIView):
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

