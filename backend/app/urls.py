from django.urls import path, include
from . import views
from .views.professoresPendentes import *

urlpatterns = [
    path('professores', views.GetProfessores.as_view(), name='professor-list-create'),
    path('criar-tcc', views.CriarTCView.as_view(), name='criar_tcc'),
    path('criar-usuario', views.CriarUsuarioView.as_view(), name='criar_usuario'),
    path('autenticar', views.ObterTokenView.as_view(), name='autenticar usuario'),
    path('detalhes-estudante', views.DetalhesEstudanteView.as_view(), name='detalhes_estudante'),
    path('proposta-submetida', views.PropostaSubmetidaView.as_view(), name='proposta-submetida'),
    path('atualizar-datas-propostas', views.AtualizarDatasPropostasView.as_view(), name='atualizar-datas-propostas'),
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes_usuario'),
    path('professores-internos-pendentes', views.professoresPendentes.ProfessorListAPIView.as_view(), name='professores-internos-pendentes'),
    path('professores-externos-pendentes', views.professoresPendentes.ProfessorExternoListAPIView.as_view(), name='professores-externos-pendentes'),
]

