from django.urls import path, include
from . import views
from .views import CriarTCView
from .views import CriarUsuarioView
from .views import ObterTokenView

urlpatterns = [
    path('getprofessores/', views.GetProfessores.as_view(), name='professor-list-create'),
    path('criar-tcc/', CriarTCView.as_view(), name='criar_tcc'),
    path('criar-usuario/', CriarUsuarioView.as_view(), name='criar_usuario'),
    path('autenticar/', ObterTokenView.as_view(), name='autenticar usuario')
]
