from django.urls import path
from . import views

urlpatterns = [
    path('getprofessores/', views.GetProfessores.as_view(), name='professor-list-create'),
]
