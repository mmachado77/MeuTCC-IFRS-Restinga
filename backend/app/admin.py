from django.contrib import admin
from .models import avaliacao, statusCadastro, tema, sessaoFinal, tcc, coordenador, statusTcc, professorInterno, professorExterno, estudante, convite, configuracoes

# Register your models here.
admin.site.register(avaliacao.Avaliacao)
admin.site.register(statusCadastro.StatusCadastro)
admin.site.register(tema.Tema)
admin.site.register(sessaoFinal.SessaoFinal)
admin.site.register(tcc.Tcc)
admin.site.register(coordenador.Coordenador)
admin.site.register(statusTcc.StatusTcc)
admin.site.register(professorInterno.ProfessorInterno)
admin.site.register(professorExterno.ProfessorExterno)
admin.site.register(estudante.Estudante)
admin.site.register(convite.Convite)
admin.site.register(configuracoes.Configuracoes)

