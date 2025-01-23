from rest_framework.permissions import BasePermission
from app.models import SuperAdmin, Coordenador

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

from rest_framework.permissions import BasePermission
from app.models import SuperAdmin, Coordenador

class IsSuperAdminOrCoordenador(BasePermission):
    """
    Permissão personalizada que verifica se o usuário é SuperAdmin ou Coordenador
    (apenas uma das condições precisa ser satisfeita).
    """

    def has_permission(self, request, view):
        # Verifica se o usuário está autenticado
        if not request.user or not request.user.is_authenticated:
            return False

        # Verifica se é SuperAdmin
        is_superadmin = SuperAdmin.objects.filter(user=request.user).exists()

        # Verifica se é Coordenador e se está associado ao curso da URL
        curso_id = view.kwargs.get('curso_id') or view.kwargs.get('pk')
        is_coordenador = (
            Coordenador.objects.filter(user=request.user, curso__id=curso_id).exists()
            if curso_id else False
        )

        # Retorna True se uma das condições for verdadeira
        return is_superadmin or is_coordenador
