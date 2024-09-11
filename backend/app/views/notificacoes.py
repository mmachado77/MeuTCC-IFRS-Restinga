from .custom_api_view import CustomAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from notifications.models import Notification
from app.serializers import NotificacaoSerializer

class ListarNotificacoesNaoLidas(CustomAPIView):
    """
    API para listar todas as notificações de um usuário, incluindo a contagem de notificações não lidas.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        get(request, format=None): Retorna todas as notificações e a contagem de notificações não lidas.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Retorna todas as notificações de um usuário e a contagem de notificações não lidas.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP com as notificações e a contagem de não lidas.
        """
        unread_notifications = Notification.objects.unread().filter(recipient=request.user)
        notifications = Notification.objects.filter(recipient=request.user)
        serializer = NotificacaoSerializer(notifications, many=True)
        unread_count = unread_notifications.count()
        data = {
            'notifications': serializer.data,
            'unread_count': unread_count
        }
        return Response(data)

class MarcarNotificacoesComoLidas(CustomAPIView):
    """
    API para marcar todas as notificações de um usuário como lidas.

    Permissões:
        Apenas usuários autenticados podem acessar esta API.

    Métodos:
        post(request, format=None): Marca todas as notificações como lidas.
    """
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        """
        Marca todas as notificações de um usuário como lidas.

        Args:
            request (Request): A requisição HTTP.
            format (str, opcional): O formato de resposta.

        Retorna:
            Response: Resposta HTTP confirmando que as notificações foram marcadas como lidas.
        """
        notifications = Notification.objects.unread().filter(recipient=request.user)
        notifications.mark_all_as_read()
        return Response({"status": "success", "message": "Notificações marcadas como lidas."})
