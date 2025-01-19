from rest_framework.permissions import BasePermission

class IsSuperAdmin(BasePermission):
    """
    Permissão para verificar se o usuário é SuperAdmin.
    """

    def has_permission(self, request, view):
        # Verifica se o usuário está autenticado e tem o atributo de SuperAdmin
        return request.user.is_authenticated and getattr(request.user, 'is_superuser', False)
