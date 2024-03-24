from django.contrib import admin

from .models import Avaliacao, Banca, BancaPrioridade, Configuracoes, Convite, Coordenador, Estudante, Professor, HorarioAtendimento, ProfessorExterno, ProfessorInterno, Sessao, SessaoFinal, SessaoPrevia, StatusCadastro, StatusTCC, Tcc, Tema, Usuario

# Register your models here.
admin.site.register((
    Usuario,
    Estudante,
    Professor,
    HorarioAtendimento,
    ProfessorInterno,
    ProfessorExterno,
    Tcc,
    Avaliacao,
    Sessao,
    SessaoFinal,
    SessaoPrevia,
    Banca,
    BancaPrioridade,
    Configuracoes,
    Convite,
    Coordenador,
    StatusCadastro,
    StatusTCC,
    Tema,
))