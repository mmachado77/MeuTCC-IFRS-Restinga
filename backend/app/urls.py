from django.urls import path, include
from . import views
from .views.professoresPendentes import *

urlpatterns = [
    path('professores', views.GetProfessores.as_view(), name='professor-list-create'),
    path('criar-tcc', views.CriarTCView.as_view(), name='criar-tcc'),
    path('criar-usuario', views.CriarUsuarioView.as_view(), name='criar-usuario'),
    path('autenticar', views.ObterTokenView.as_view(), name='autenticar-usuario'),
    path('proposta-submetida', views.PropostaSubmetidaView.as_view(), name='proposta-submetida'),
    path('atualizar-datas-propostas', views.AtualizarDatasPropostasView.as_view(), name='atualizar-datas-propostas'),
    path('professores-internos-pendentes', views.professoresPendentes.ProfessorListAPIView.as_view(), name='professores-internos-pendentes'),
    path('professores-externos-pendentes', views.professoresPendentes.ProfessorExternoListAPIView.as_view(), name='professores-externos-pendentes'),
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes-usuario'),
    path('listar-usuarios', views.ListarUsuarios.as_view(), name='listar-usuarios'),
]

