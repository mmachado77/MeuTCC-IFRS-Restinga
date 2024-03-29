# py manage.py shell
# >>> exec(open('script_inicial.py').read())

from app.models.configuracoes import Configuracoes
from app.models.professorInterno import ProfessorInterno
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

teste = User.objects.get(pk=1)

andre = ProfessorInterno(nome="André Schneider", 
                         cpf="12345678911", 
                         email="andre@restinga.ifrs.edu.br",
                         area = "Informática",
                         grau_academico = "Mestre",
                         titulos="Rei do VPL, Inimigo do Python",
                         matricula="1994000401",
                         user = teste
                        )
andre.save()
andre = ProfessorInterno.objects.get(pk=1)

configMaster = Configuracoes (coordenadorAtual=andre)

print("Professores Internos criados com sucesso!")