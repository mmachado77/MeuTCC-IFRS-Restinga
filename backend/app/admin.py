from django.contrib import admin
from .models.avaliacao import Avaliacao
from .models.banca import Banca
from .models.bancaPrioridade import BancaPrioridade
from .models.configuracoes import Configuracoes
from .models.convite import Convite
from .models.coordenador import Coordenador
from .models.estudante import Estudante
from .models.professor import Professor
from .models.professorExterno import ProfessorExterno
from .models.professorInterno import ProfessorInterno
from .models.sessao import Sessao
from .models.sessaoFinal import SessaoFinal
from .models.sessaoPrevia import SessaoPrevia
from .models.statusCadastro import StatusCadastro
from .models.statusTcc import StatusTCC
from .models.tcc import Tcc
from .models.tema import Tema
from .models.usuario import Usuario

# Register your models here.
admin.site.register(Avaliacao)
admin.site.register(Banca)
admin.site.register(BancaPrioridade)
admin.site.register(Configuracoes)
admin.site.register(Convite)
admin.site.register(Coordenador)
admin.site.register(Estudante)
admin.site.register(Professor)
admin.site.register(ProfessorExterno)
admin.site.register(ProfessorInterno)
admin.site.register(Sessao)
admin.site.register(SessaoFinal)
admin.site.register(SessaoPrevia)
admin.site.register(StatusCadastro)
admin.site.register(StatusTCC)
admin.site.register(Tcc)
admin.site.register(Tema)
admin.site.register(Usuario)