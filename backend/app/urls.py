from django.urls import path
from . import views
from .views import CriarTCView

urlpatterns = [
    path('getprofessores/', views.GetProfessores.as_view(), name='professor-list-create'),
    path('criar-tcc/', CriarTCView.as_view(), name='criar_tcc')
]
