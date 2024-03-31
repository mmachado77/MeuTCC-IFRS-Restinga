from django.urls import path, include
from . import views


urlpatterns = [
    path('professores', views.GetProfessores.as_view(), name='professor-list-create'),
    path('criar-tcc', views.CriarTCView.as_view(), name='criar-tcc'),
    path('criar-usuario', views.CriarUsuarioView.as_view(), name='criar-usuario'),
    path('autenticar', views.ObterTokenView.as_view(), name='autenticar-usuario'),
    path('proposta-submetida', views.PropostaSubmetidaView.as_view(), name='proposta-submetida'),
    path('atualizar-datas-propostas', views.AtualizarDatasPropostasView.as_view(), name='atualizar-datas-propostas'),
    path('professores-pendentes', views.ProfessoresPendentesListAPIView.as_view(), name='professores-pendentes'),
    path('aprovar-professor/<int:idProfessor>', views.AprovarProfessorAPIView.as_view(), name='aprovar-professor'),
    path('recusar-professor/<int:idProfessor>', views.RecusarProfessorAPIView.as_view(), name='recusar-professor'),
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes-usuario'),
    path('listar-usuarios', views.ListarUsuarios.as_view(), name='listar-usuarios'),
    path('detalhes-tcc/<int:tccid>/', views.DetalhesTCCView.as_view(), name='detalhes_tcc'),
    path('listar-tccs-pendente', views.ListarTccPendente.as_view(), name='listar-tccs'),
    path('atualizar-tcc-status/<int:tccId>', views.AtualizarTccStatus.as_view(), name='atualizar-tcc-status'),
]

