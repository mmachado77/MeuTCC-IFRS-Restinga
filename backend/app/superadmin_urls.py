from django.urls import path
from app.views.superadmin import *
from app.views.curso import *

urlpatterns = [
    path('login/', SuperAdminLoginView.as_view(), name='login'),
    path('detalhes/', SuperAdminDetailsView.as_view(), name='detalhes'),
    path('cursos/', CursoListView.as_view(), name='curso-list'),
    path('cursos/<int:pk>/', CursoDetailView.as_view(), name='curso-detail'),
]
