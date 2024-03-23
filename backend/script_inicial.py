# py manage.py shell
# >>> exec(open('script_inicial.py').read())

from app.models.usuario import Usuario
from app.models.professor import Professor
from app.models.professorInterno import ProfessorInterno

andre = ProfessorInterno(nome="André Schneider", 
                         cpf="12345678911", 
                         email="andre@restinga.ifrs.edu.br",
                         area = "Informática",
                         grau_academico = "Mestre",
                         titulos="Rei do VPL, Inimigo do Python",
                         matricula="1994000401")
andre.save()
roben = ProfessorInterno(nome="Roben Lunardi", 
                         cpf="12345678913", 
                         email="roben@restinga.ifrs.edu.br",
                         area = "Segurança da Informação",
                         grau_academico = "Mestre",
                         titulos="Coordenador Supremo, Inimigo do MD5",
                         matricula="2024000401")
roben.save()
eliana = ProfessorInterno(nome="Eliana Pereira", 
                         cpf="12345678915", 
                         email="eliana@restinga.ifrs.edu.br",
                         area = "Gestão de Projetos",
                         grau_academico = "Mestre",
                         titulos="Scrum Professional, Rainha dos Diagramas",
                         matricula="1987000401")
eliana.save()
ricardo = ProfessorInterno(nome="Ricardo dos Santos", 
                         cpf="12345678917", 
                         email="ricardo@restinga.ifrs.edu.br",
                         area = "FULL-STACK",
                         grau_academico = "Mestre",
                         titulos="Inventou o Django",
                         matricula="1903000401")
ricardo.save()