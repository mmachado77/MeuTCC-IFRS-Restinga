from rest_framework.permissions import BasePermission
from app.models import SuperAdmin  # Certifique-se de importar o modelo correto

class IsSuperAdmin(BasePermission):
    """
    Permissão personalizada para verificar se o usuário autenticado é um SuperAdmin.
    """

    def has_permission(self, request, view):
        # Verifica se o usuário está autenticado
        if not request.user or not request.user.is_authenticated:
            return False

        # Verifica se o usuário está relacionado a um SuperAdmin
        return SuperAdmin.objects.filter(user=request.user).exists()
