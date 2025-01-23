from django.urls import path
from app.views.superadmin import *
from app.views.curso import *

urlpatterns = [
    path('login/', SuperAdminLoginView.as_view(), name='login'),
    path('cursos/', CursoListView.as_view(), name='curso-list'),
    path('cursos/<int:curso_id>/', CursoDetailView.as_view(), name='curso-detail'),
    path('cursos/<int:curso_id>/trocar-coordenador/', TrocaCoordenadorAPIView.as_view(), name='trocar-coordenador'),
    path('cursos/<int:curso_id>/historico-coordenadores/', HistoricoCoordenadorAPIView.as_view(), name='trocar-coordenador'),
]
