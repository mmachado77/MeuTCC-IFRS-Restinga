from django.urls import path
from app.views.superadmin import *
from app.views.curso import *
from app.views.coordenador import *
from app.views.listar_usuarios import *
from app.views.professoresPendentes import ListaProfessoresInternosView, AprovarProfessorInternoView, RecusarProfessorInternoView

urlpatterns = [
    path('login/', SuperAdminLoginView.as_view(), name='login'),
    path('listar-usuarios', ListarUsuariosSuperAdmin.as_view(), name='listar-usuarios'),
    
    # Cursos
    path('cursos/', CursoListView.as_view(), name='curso-list'),
    path('cursos/criar/', CriarCursoView.as_view(), name='criar_curso'),
    path('cursos/<int:curso_id>/', CursoDetailView.as_view(), name='curso-detail'),
    path('cursos/<int:curso_id>/trocar-coordenador/', TrocaCoordenadorAPIView.as_view(), name='trocar-coordenador'),
    path('cursos/<int:curso_id>/historico-coordenadores/', HistoricoCoordenadorAPIView.as_view(), name='historico-coordenador'),
    path('cursos/<int:curso_id>/adicionar-professor/', AdicionarProfessorCursoView.as_view(), name='adicionar-professor-curso'),
    path('cursos/<int:curso_id>/remover-professor/', RemoverProfessorCursoView.as_view(), name='remover-professor-curso'),
    path('cursos/<int:curso_id>/atualizar-visibilidade/', UpdateCursoVisibilityView.as_view(), name='atualizar-visibilidade'),

    # Coordenadores
    path('coordenadores/listar/', ListarCoordenadoresView.as_view(), name='listar-coordenadores'),
    path('coordenadores/<int:coordenador_id>/adicionar-curso/', AdicionarCursoCoordenadorView.as_view(), name='adicionar-curso-coordenador'),
    path('coordenadores/<int:coordenador_id>/limpar-curso/', LimparCursoCoordenadorView.as_view(), name='limpar-curso-coordenador'),

    # Professores Internos (SuperAdmin)
    path('professores-internos/', ListaProfessoresInternosView.as_view(), name='listar-professores-internos'),
    path('professores-internos/<int:pk>/aprovar/', AprovarProfessorInternoView.as_view(), name='aprovar-professor-interno'),
    path('professores-internos/<int:pk>/recusar/', RecusarProfessorInternoView.as_view(), name='recusar-professor-interno'),
]
