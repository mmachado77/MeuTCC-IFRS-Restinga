from django.urls import path, include
from . import views


urlpatterns = [
    path('professores', views.GetProfessores.as_view(), name='professor-list-create'),
    path('professores-internos', views.GetProfessoresInternos.as_view(), name='professores-internos'),
    path('criar-tcc', views.CriarTCCView.as_view(), name='criar-tcc'),
    path('criar-usuario', views.CriarUsuarioView.as_view(), name='criar-usuario'),
    path('autenticar', views.ObterTokenView.as_view(), name='autenticar-usuario'),
    path('atualizar-datas-propostas', views.AtualizarDatasPropostasView.as_view(), name='atualizar-datas-propostas'),
    path('alterar-coordenador', views.AlterarCoordenador.as_view(), name='alterar-coordenador'),
    path('coordenador', views.GetCoordenador.as_view(), name='coordenador'),
    path('professores-pendentes', views.ProfessoresPendentesListAPIView.as_view(), name='professores-pendentes'),
    path('aprovar-professor/<int:idProfessor>', views.AprovarProfessorAPIView.as_view(), name='aprovar-professor'),
    path('recusar-professor/<int:idProfessor>', views.RecusarProfessorAPIView.as_view(), name='recusar-professor'),
    path('detalhes-usuario', views.DetalhesUsuario.as_view(), name='detalhes-usuario'),
    path('listar-usuarios', views.ListarUsuarios.as_view(), name='listar-usuarios'),
    path('detalhes-tcc/<int:tccid>/', views.DetalhesTCCView.as_view(), name='detalhes_tcc'),
    path('listar-tccs-pendente', views.ListarTccPendente.as_view(), name='listar-tccs'),
    path('tccs', views.MeusTCCs.as_view(), name='tccs'),
    path('possui-proposta', views.PossuiProposta.as_view(), name='possui-proposta'),
    path('responder-proposta/<int:tccId>', views.TccStatusResponderPropostaView.as_view(), name='responder-proposta'),
]

