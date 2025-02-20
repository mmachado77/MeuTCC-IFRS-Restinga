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
from ..enums import StatusTccEnum
from meutcc.services import GoogleDriveService
from meutcc import settings
from app.models import SessaoFinal, SessaoPrevia, TccStatus
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
            
            # Cria os metadados em JSON
            file_metadata = {
                "id": file_id,
                "name": file_name,
                "size": file_size,
                "dataModificacao": datetime.datetime.now().isoformat()
            }
            
            # Obtém o último status do TCC
            ultimo_status = TccStatus.objects.filter(tcc=tcc).order_by('-dataStatus').first()
            # Define os statuses para sessão prévia e final usando o enum
            previa_statuses = [
                StatusTccEnum.PREVIA_ORIENTADOR,
                StatusTccEnum.PREVIA_COORDENADOR,
                StatusTccEnum.PREVIA_AGENDADA
            ]
            final_statuses = [
                StatusTccEnum.FINAL_ORIENTADOR,
                StatusTccEnum.FINAL_COORDENADOR,
                StatusTccEnum.FINAL_AGENDADA
            ]
            
            # Atualiza o documento da sessão de acordo com o status atual
            if ultimo_status and ultimo_status.status in previa_statuses:
                sessao_previa = SessaoPrevia.objects.filter(tcc=tcc).first()
                if sessao_previa:
                    sessao_previa.documentoTCCSessao = json.dumps(file_metadata)
                    sessao_previa.save()
            elif ultimo_status and ultimo_status.status in final_statuses:
                sessao_final = SessaoFinal.objects.filter(tcc=tcc).first()
                if sessao_final:
                    sessao_final.documentoTCCSessao = json.dumps(file_metadata)
                    sessao_final.save()
            
            # Atualiza o campo documento do TCC
            tcc.documentoTCC = json.dumps(file_metadata)
            tcc.save()
            
            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class UploadDocumentoSessaoView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]
    googleDriveService = GoogleDriveService()

    def post(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            file = request.FILES['file']
            file_id = self.googleDriveService.upload_file(file)
            if file_id is None:
                return Response({"error": "Falha no upload para o Google Drive"}, status=status.HTTP_400_BAD_REQUEST)

            file_metadata = {
                "id": file_id,
                "name": file.name,
                "size": file.size,
                "dataModificacao": datetime.datetime.now().isoformat()
            }
            # Armazena os metadados no campo de texto
            sessao.documentoTCCSessao = json.dumps(file_metadata)
            sessao.save()

            # Atualiza também o documento principal do TCC
            tcc = sessao.tcc
            tcc.documentoTCC = json.dumps(file_metadata)
            tcc.save()

            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UploadFichaAvaliacaoView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]
    googleDriveService = GoogleDriveService()

    def post(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            file = request.FILES['file']
            file_id = self.googleDriveService.upload_file(file)
            if file_id is None:
                return Response({"error": "Falha no upload para o Google Drive"}, status=status.HTTP_400_BAD_REQUEST)

            file_metadata = {
                "id": file_id,
                "name": file.name,
                "size": file.size,
                "dataModificacao": datetime.datetime.now().isoformat()
            }
            avaliacao.ficha_avaliacao = json.dumps(file_metadata)
            avaliacao.save()

            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UploadDocumentoAjusteView(CustomAPIView):
    parser_classes = [MultiPartParser, FormParser]
    googleDriveService = GoogleDriveService()

    def post(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            file = request.FILES['file']
            file_id = self.googleDriveService.upload_file(file)
            if file_id is None:
                return Response({"error": "Falha no upload para o Google Drive"}, status=status.HTTP_400_BAD_REQUEST)

            file_metadata = {
                "id": file_id,
                "name": file.name,
                "size": file.size,
                "dataModificacao": datetime.datetime.now().isoformat()
            }
            avaliacao.tcc_definitivo = json.dumps(file_metadata)
            avaliacao.save()

            # Atualiza o documento principal do TCC
            sessao = SessaoFinal.objects.get(avaliacao=avaliacao)
            tcc = sessao.tcc
            tcc.documentoTCC = json.dumps(file_metadata)
            tcc.save()

            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UploadAutorizacaoPublicacaoView(CustomAPIView):
    parser_classes = (MultiPartParser, FormParser)
    googleDriveService = GoogleDriveService()

    def post(self, request, tccId, *args, **kwargs):
        try:
            tcc = Tcc.objects.get(id=tccId)
            file = request.FILES['file']
            file_id = self.googleDriveService.upload_file(file)
            if file_id is None:
                return Response({"error": "Falha no upload para o Google Drive"}, status=status.HTTP_400_BAD_REQUEST)

            file_metadata = {
                "id": file_id,
                "name": file.name,
                "size": file.size,
                "dataModificacao": datetime.datetime.now().isoformat()
            }
            tcc.autorizacaoPublicacao = json.dumps(file_metadata)
            tcc.save()

            return Response({'status': 'success', 'message': 'Upload realizado com sucesso!'}, status=status.HTTP_200_OK)
        except Tcc.DoesNotExist:
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
    googleDriveService = GoogleDriveService()

    def delete(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                self.googleDriveService.delete_file(sessao.documentoTCCSessao)
            sessao.documentoTCCSessao = None
            sessao.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ExcluirFichaAvaliacaoView(CustomAPIView):
    googleDriveService = GoogleDriveService()

    def delete(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.ficha_avaliacao:
                self.googleDriveService.delete_file(avaliacao.ficha_avaliacao)
            avaliacao.ficha_avaliacao = None
            avaliacao.save()
            return Response({'status': 'alert', 'message': 'Documento excluido!'}, status=status.HTTP_200_OK)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ExcluirDocumentoAjusteView(CustomAPIView):
    googleDriveService = GoogleDriveService()

    def delete(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.tcc_definitivo:
                self.googleDriveService.delete_file(avaliacao.tcc_definitivo)
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
    googleDriveService = GoogleDriveService()

    def get(self, request, sessaoId):
        try:
            sessao = Sessao.objects.get(id=sessaoId)
            if sessao.documentoTCCSessao:
                file_metadata = json.loads(sessao.documentoTCCSessao)
                file_id = file_metadata.get("id")
                if not file_id:
                    raise Exception("ID do documento não encontrado")
                content, file_name = self.googleDriveService.download_file(file_id)
                response = FileResponse(content, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Sessao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DownloadFichaAvaliacaoView(CustomAPIView):
    googleDriveService = GoogleDriveService()

    def get(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.ficha_avaliacao:
                file_metadata = json.loads(avaliacao.ficha_avaliacao)
                file_id = file_metadata.get("id")
                if not file_id:
                    raise Exception("ID do documento não encontrado")
                content, file_name = self.googleDriveService.download_file(file_id)
                response = FileResponse(content, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DownloadDocumentoAjusteView(CustomAPIView):
    googleDriveService = GoogleDriveService()

    def get(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.tcc_definitivo:
                file_metadata = json.loads(avaliacao.tcc_definitivo)
                file_id = file_metadata.get("id")
                if not file_id:
                    raise Exception("ID do documento não encontrado")
                content, file_name = self.googleDriveService.download_file(file_id)
                response = FileResponse(content, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DownloadFichaAvaliacaoView(CustomAPIView):
    googleDriveService = GoogleDriveService()

    def get(self, request, avaliacaoId):
        try:
            avaliacao = Avaliacao.objects.get(id=avaliacaoId)
            if avaliacao.ficha_avaliacao:
                file_metadata = json.loads(avaliacao.ficha_avaliacao)
                file_id = file_metadata.get("id")
                if not file_id:
                    raise Exception("ID do documento não encontrado")
                content, file_name = self.googleDriveService.download_file(file_id)
                response = FileResponse(content, as_attachment=True)
                response['Content-Disposition'] = f'attachment; filename="{file_name}"'
                return response
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Avaliacao.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


