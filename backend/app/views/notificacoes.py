from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from notifications.models import Notification
from app.serializers import NotificacaoSerializer

class ListarNotificacoesNaoLidas(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        unread_notifications = Notification.objects.unread().filter(recipient=request.user)
        notifications = Notification.objects.filter(recipient=request.user)
        serializer = NotificacaoSerializer(notifications, many=True)
        unread_count = unread_notifications.count()
        data = {
            'notifications': serializer.data,
            'unread_count': unread_count
        }
        return Response(data)

class MarcarNotificacoesComoLidas(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        notifications = Notification.objects.unread().filter(recipient=request.user)
        notifications.mark_all_as_read()
        return Response({"message": "Notificações marcadas como lidas."})
