from rest_framework.permissions import BasePermission
from app.models.superadmin import SuperAdmin

class IsSuperAdmin(BasePermission):
    """
    Permissão para garantir que apenas SuperAdmins tenham acesso.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and isinstance(request.user, SuperAdmin)