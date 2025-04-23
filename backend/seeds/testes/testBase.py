from django.contrib.auth.models import User
from app.models import Curso, ProfessorInterno, SuperAdmin, Estudante, StatusCadastro, Coordenador, Semestre
from datetime import datetime, timedelta

# ==========================
# 👤 Criação de Usuários
# ==========================

if not SuperAdmin.objects.filter(email="super@admin.com").exists():
    SuperAdmin.objects.create_superuser(
        email="super@admin.com",
        password="admin123"
    )

if not User.objects.filter(email="admin@admin.com").exists():
    User.objects.create_user(
        username="admin",
        email="admin@admin.com",
        password="admin123"
    )

if not User.objects.filter(email="sistema.tcc@restinga.ifrs.edu.br").exists():
    User.objects.create_user(
        username="notifyuser",
        email="sistema.tcc@restinga.ifrs.edu.br",
        password="123"
    )

# ==========================
# 🟢 Status de Cadastro
# ==========================

status1 = StatusCadastro.objects.create(aprovacao=True)
status2 = StatusCadastro.objects.create(aprovacao=True)
status3 = StatusCadastro.objects.create(aprovacao=True)
status4 = StatusCadastro.objects.create(aprovacao=True)
status5 = StatusCadastro.objects.create(aprovacao=True)
status6 = StatusCadastro.objects.create(aprovacao=True)
status7 = StatusCadastro.objects.create(aprovacao=True)
status8 = StatusCadastro.objects.create(aprovacao=True)
status9 = StatusCadastro.objects.create(aprovacao=True)
status10 = StatusCadastro.objects.create(aprovacao=True)
status11 = StatusCadastro.objects.create(aprovacao=True)
status12 = StatusCadastro.objects.create(aprovacao=True)
status13 = StatusCadastro.objects.create(aprovacao=True)
status14 = StatusCadastro.objects.create(aprovacao=True)
status15 = StatusCadastro.objects.create(aprovacao=True)

# ==========================
# 🏫 Criação de Curso ADS
# ==========================

ads = Curso.objects.create(
    nome="Tecnologia em Análise e Desenvolvimento de Sistemas",
    sigla="ADS",
    descricao="Curso tecnologico focado no desenvolvimento de sistemas computacionais.",
    ultima_atualizacao=datetime.today(),
    data_criacao=datetime.today(),
    limite_orientacoes=3,
    regra_sessao_publica="Obrigatório",
    prazo_propostas_inicio=datetime.today(),
    prazo_propostas_fim=datetime.today() + timedelta(days=30),
    visible=True
)

lpg = Curso.objects.create(
    nome="Licenciatura em Letras Português e Espanhol",
    sigla="LPG",
    descricao="Oportuniza o domínio do uso das línguas portuguesa e espanhola, considerando os seus funcionamentos e suas manifestações culturais, em especial, através dos estudos literários. Busca uma reflexão analítica e crítica sobre a linguagem como fenômeno social, educacional, psicológico, histórico, cultural, político e ideológico, bem como uma visão crítica das perspectivas teóricas adotadas nas investigações linguísticas e literárias, que fundamentam sua formação profissional.",
    ultima_atualizacao=datetime.today(),
    data_criacao=datetime.today(),
    limite_orientacoes=1,
    regra_sessao_publica="Desabilitar",
    prazo_propostas_inicio=datetime.today(),
    prazo_propostas_fim=datetime.today() + timedelta(days=30),
    visible=True
)
gdl = Curso.objects.create(
    nome="Gestão Desportiva e Lazer",
    sigla="GDL",
    descricao="Busca formar um profissional com capacidade investigativa, empreendedora e que possa interferir positivamente nos espaços de esporte e lazer, que seja capaz de: elaborar, implementar e gerir projetos na área; gerenciar planos estratégicos de inserção na área em instituições públicas e empresas privadas; elaborar e implementar planos de marketing esportivo e de lazer; criar empreendimentos de serviços na área; desenvolver projetos de pesquisa acadêmica; planejar, organizar, promover, dirigir, captar recursos, coordenar, executar e gerir políticas, programas, projetos e eventos.",
    ultima_atualizacao=datetime.today(),
    data_criacao=datetime.today(),
    limite_orientacoes=2,
    regra_sessao_publica="Obrigatório",
    prazo_propostas_inicio=datetime.today(),
    prazo_propostas_fim=datetime.today() + timedelta(days=30),
    visible=True
)

# ==========================
# 👨‍🏫 Professores Internos
# ==========================

professores = [
    ("André Schneider", "12345678911", "andre@restinga.ifrs.edu.br", "1994000401", status1),
    ("Carla Souza", "12345678912", "carla@restinga.ifrs.edu.br", "1994000402", status2),
    ("Diego Martins", "12345678913", "diego@restinga.ifrs.edu.br", "1994000403", status3),
    ("Fernanda Lima", "12345678914", "fernanda@restinga.ifrs.edu.br", "1994000404", status4),
    ("Bruno Costa", "12345678915", "bruno@restinga.ifrs.edu.br", "1994000405", status5),
    ("Luciana Rocha", "12345678916", "luciana@restinga.ifrs.edu.br", "1994000406", status6),
    ("Rodrigo Alves", "12345678917", "rodrigo@restinga.ifrs.edu.br", "1994000407", status7),
    ("Marina Teixeira", "12345678918", "marina@restinga.ifrs.edu.br", "1994000408", status8),
    ("Eduardo Pires", "12345678919", "eduardo@restinga.ifrs.edu.br", "1994000409", status9),
    ("Juliana Farias", "12345678920", "juliana@restinga.ifrs.edu.br", "1994000410", status10),
    ("Ricardo Mendes", "12345678921", "ricardo@restinga.ifrs.edu.br", "1994000411", status11),
    ("Patrícia Nunes", "12345678922", "patricia@restinga.ifrs.edu.br", "1994000412", status12),
    ("Thiago Ribeiro", "12345678923", "thiago@restinga.ifrs.edu.br", "1994000413", status13),
    ("Isabela Moura", "12345678924", "isabela@restinga.ifrs.edu.br", "1994000414", status14),
    ("Leandro Vieira", "12345678925", "leandro@restinga.ifrs.edu.br", "1994000415", status15),
]

cursos = [ads, lpg, gdl]

for i, (nome, cpf, email, matricula, status) in enumerate(professores):
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(email, email, "senha123")
        curso_atual = cursos[i // 5]  # 0–4 → ads, 5–9 → lpg, 10–14 → gdl

        prof = ProfessorInterno.objects.create(
            nome=nome,
            cpf=cpf,
            email=email,
            area_atuacao="CIENCIA DA COMPUTACAO",
            titulo="DOUTORADO",
            area_interesse='["ESTRUTURA"]',
            matricula=matricula,
            status=status,
            user=user,
            avatar="https://primefaces.org/cdn/primereact/images/organization/walter.jpg"
        )
        prof.cursos.set([curso_atual])


# ==========================
# 📅 Semestres
# ==========================

Semestre.objects.create(
    periodo='2025/1',
    dataAberturaSemestre='2025-01-01',
    dataFechamentoSemestre='2025-06-30',
)

Semestre.objects.create(
    periodo='2024/1',
    dataAberturaSemestre='2024-01-01',
    dataFechamentoSemestre='2024-06-30',
)

# ==========================
# 👩‍🎓 Estudantes de ADS
# ==========================

nomes_estudantes = [
    "Lucas Martins", "Julia Santos", "Marcos Silva", "Ana Beatriz", "Pedro Henrique",
    "Larissa Costa", "Rafael Oliveira", "Bruna Lima", "Gabriel Souza", "Isabela Rocha",
    "Caio Almeida", "Fernanda Cardoso", "Vinícius Ramos", "Camila Torres", "Thiago Barbosa"
]

cursos = [ads, lpg, gdl]

for j in range(15):
    curso_atual = cursos[j // 5]  # 0–4: ads, 5–9: lpg, 10–14: gdl
    email = f"estudante_{curso_atual.nome.upper()}_{j+1}@restinga.ifrs.edu.br"
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(
            username=f"estudante_{curso_atual.nome.upper()}_{j+1}",
            email=email,
            password="senha123"
        )
        Estudante.objects.create(
            nome=nomes_estudantes[j],
            cpf=f"123456789{j:02}",
            email=email,
            curso=curso_atual,
            user=user
        )


# ==========================
# 👨‍💼 Coordenadores
# ==========================

coordenadores = [
    ("Coordenador ADS", "coord_ads", "ads.coord@restinga.ifrs.edu.br", "12345678999", ads),
    ("Coordenador LPG", "coord_lpg", "lpg.coord@restinga.ifrs.edu.br", "12345678998", lpg),
    ("Coordenador GDL", "coord_gdl", "gdl.coord@restinga.ifrs.edu.br", "12345678997", gdl),
]

for nome, username, email, cpf, curso in coordenadores:
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(
            username=username,
            email=email,
            password="senha123"
        )
        Coordenador.objects.create(
            nome=nome,
            cpf=cpf,
            email=email,
            user=user,
            curso=curso
        )


print("Script base de testes executado com sucesso!")