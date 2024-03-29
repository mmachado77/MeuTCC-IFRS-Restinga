# py manage.py shell
# >>> exec(open('script_inicial.py').read())

from django.contrib.auth.models import User
from app.models import Configuracoes, ProfessorInterno, Estudante, StatusCadastro, Coordenador

# Criando usuário admin
user = User.objects.create_superuser("admin", "admin@admin.com", "admin")

# Cria Status André
status = StatusCadastro.objects.create(
    aprovacao = True
)

# Cria um professor interno
andre = ProfessorInterno.objects.create(nome="André Schneider", 
                         cpf="12345678911", 
                         email="andre@restinga.ifrs.edu.br",
                         area = "Informática",
                         grau_academico = "Mestre",
                         titulos="Rei do VPL, Inimigo do Python",
                         matricula="1994000401",
                         status = status,
                         user = user
                        )

# Adiciona professor como atual coordenador
configMaster = Configuracoes (coordenadorAtual=andre)

# Cria usuario estudante
estudanteUser = User.objects.create_user("estudante@gmail.com", "estudante@gmail.com", "12345678912")
estudante = Estudante.objects.create(nome="Estudante", 
                      cpf="12345678912", 
                      email="estudante@gmail.com",
                      user=estudanteUser)

coordenadorUser = User.objects.create_user("coordenador@gmail.com", "coordenador@gmail.com", "151515")
coordenador = Coordenador.objects.create(nome="Coordenador", cpf="151515", email="coordenador@gmail.com", user = coordenadorUser)

print("Professores Internos criados com sucesso!")