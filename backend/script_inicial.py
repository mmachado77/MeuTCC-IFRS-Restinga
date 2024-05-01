# py manage.py shell
# >>> exec(open('script_inicial.py').read())

from django.contrib.auth.models import User
from app.models import TccStatus, Tcc, Semestre, ProfessorInterno, Estudante, StatusCadastro, Coordenador, ProfessorExterno, Convite, SemestreCoordenador
from datetime import datetime

# Criando usuário admin
superuser = User.objects.create_superuser("admin", "admin@admin.com", "123")

# Cria Status André
status = StatusCadastro.objects.create(
    aprovacao = True
)
status2 = StatusCadastro.objects.create(
    aprovacao = False
)
status3 = StatusCadastro.objects.create(
    aprovacao = False
)

status4 = StatusCadastro.objects.create(
    aprovacao = True
)
status5 = StatusCadastro.objects.create(
    aprovacao = False
)

# Cria um professor interno
andreUser = User.objects.create_user("andre@restinga.ifrs.edu.br", "andre@restinga.ifrs.edu.br", "151515")
andre = ProfessorInterno.objects.create(nome="André Schneider", 
                         cpf="12345678911", 
                         email="andre@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse="Estrutura",
                         matricula="1994000401",
                         status = status,
                         user = andreUser,
                         avatar="https://primefaces.org/cdn/primereact/images/organization/walter.jpg"
                        )

ProfInterUser = User.objects.create_user("cleitin@restinga.ifrs.edu.br", "cleitin@restinga.ifrs.edu.br", "05156413231")
cleitin = ProfessorInterno.objects.create(nome="Cleitin da Silva", 
                         cpf="05156413231", 
                         email="cleitin@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse="Estrutura",
                         matricula="1994000402",
                         status = status4,
                         user = ProfInterUser
                        )

ProfInter2User = User.objects.create_user("interno@restinga.ifrs.edu.br", "interno@restinga.ifrs.edu.br", "05156413232")
adastolfo = ProfessorInterno.objects.create(nome="Adastolfo", 
                         cpf="05156413232", 
                         email="interno@restinga.ifrs.edu.br",
                         area_atuacao = "CIENCIA DA COMPUTACAO",
                         titulo="DOUTORADO",
                         area_interesse="Estrutura",
                         matricula="1994000402",
                         status = status5,
                         user = ProfInter2User
                        )

# Adiciona professor como atual coordenador
# Cria usuario estudante
estudanteUser = User.objects.create_user("estudante@gmail.com", "estudante@gmail.com", "12345678912")
estudante = Estudante.objects.create(nome="Estudante", 
                      cpf="12345678912", 
                      email="estudante@gmail.com",
                      user=estudanteUser)

coordenadorUser = User.objects.create_user("coordenador@gmail.com", "coordenador@gmail.com", "151515")
coordenador = Coordenador.objects.create(nome="Coordenador", cpf="151515", email="coordenador@gmail.com", user = coordenadorUser)

ProfExternoUser = User.objects.create_user("externo@gmail.com", "externo@gmail.com", "98765432153")
ProfExterno = ProfessorExterno.objects.create(
                        nome="ProfExterno",
                        cpf="98765432153", 
                        email="externo@gmail.com",
                        area_atuacao = "CIENCIA DA COMPUTACAO",
                        titulo="DOUTORADO",
                        area_interesse="Estrutura",
                        status = status3,
                        user = ProfExternoUser
                        )

ProfExterno2User = User.objects.create_user("externo2@gmail.com", "externo2@gmail.com", "98765432154")
ProfExterno = ProfessorExterno.objects.create(
                        nome="ProfExterno2",
                        cpf="98765432154", 
                        email="externo2@gmail.com",
                        area_atuacao = "CIENCIA DA COMPUTACAO",
                        titulo="DOUTORADO",
                        area_interesse="Estrutura",
                        status = status2,
                        user = ProfExterno2User
                        )

semestre1 = Semestre.objects.create(
        periodo='2024/1',
        dataAberturaSemestre='2024-01-01',
        dataFechamentoSemestre='2024-06-30',
        dataAberturaPrazoPropostas='2024-03-20',
        dataFechamentoPrazoPropostas='2024-04-15',
    )

semestre2 = Semestre.objects.create(
        periodo='2023/2',
        dataAberturaSemestre='2023-07-01',
        dataFechamentoSemestre='2023-12-31',
        dataAberturaPrazoPropostas='2023-07-15',
        dataFechamentoPrazoPropostas='2023-08-22',
    )

coordSemestre = SemestreCoordenador.objects.create(
    coordenador=andre,
    semestre = semestre1
)

tcc = Tcc.objects.create(
        autor= estudante,
        orientador= cleitin,
        semestre= semestre1,
        tema='Pesquisa sobre o porquê o Tiririca é tão bom deputado',
        resumo='Este trabalho apresenta uma pesquisa sobre o porquê o Tiririca é tão bom deputado.'
    )

tcc2 = Tcc.objects.create(
        autor= estudante,
        orientador= cleitin,
        semestre= semestre2,
        tema='Desenvolvimento de um Sistema de Gerenciamento de Tarefas',
        resumo='Este trabalho apresenta o desenvolvimento de um sistema web para gerenciamento de tarefas, utilizando Django como framework.'
    )

tcc_status = TccStatus.objects.create(
                        status= "REPROVADO_PREVIA",
                        dataStatus= datetime.today(),
                        tcc= tcc                                

)

tcc_status = TccStatus.objects.create(
                        status= "PROPOSTA_ANALISE_PROFESSOR",
                        dataStatus= datetime.today(),
                        tcc= tcc2                                

)

print("Usuários criados com sucesso!")