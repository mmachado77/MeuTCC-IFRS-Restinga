from django.contrib.auth.backends import ModelBackend
from app.models.superadmin import SuperAdmin

class SuperAdminBackend(ModelBackend):
    """
    Backend de autenticação exclusivo para SuperAdmin.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = SuperAdmin.objects.get(email=username)
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except SuperAdmin.DoesNotExist:
            return None
        return None
