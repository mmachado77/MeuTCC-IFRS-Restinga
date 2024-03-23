from django.contrib import admin
from .models import avaliacao, statusCadastro, tema, sessaoFinal, sessao, tcc, professor, coordenador

# Register your models here.
admin.site.register(avaliacao.Avaliacao)
admin.site.register(statusCadastro.StatusCadastro)
admin.site.register(tema.Tema)
admin.site.register(sessaoFinal.SessaoFinal)
admin.site.register(sessao.Sessao)
admin.site.register(tcc.Tcc)
admin.site.register(professor.Professor)
admin.site.register(coordenador.Coordenador)

