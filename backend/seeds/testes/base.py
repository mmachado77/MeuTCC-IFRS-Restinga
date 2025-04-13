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
    regra_sessao_publica="OBRIGATORIO",
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
]

for nome, cpf, email, matricula, status in professores:
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(email, email, "senha123")
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
        prof.cursos.set([ads])

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

nomes_estudantes = ["Lucas Martins", "Julia Santos"]

for j in range(2):
    email = f"estudante_ADS_{j+1}@restinga.ifrs.edu.br"
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_user(
            username=f"estudante_ADS_{j+1}",
            email=email,
            password="senha123"
        )
        Estudante.objects.create(
            nome=nomes_estudantes[j],
            cpf=f"123456789{j:02}",
            email=email,
            curso=ads,
            user=user
        )

# ==========================
# 👨‍💼 Coordenador de ADS
# ==========================

if not User.objects.filter(email="ads.coord@restinga.ifrs.edu.br").exists():
    user = User.objects.create_user(
        username="coord_ads",
        email="ads.coord@restinga.ifrs.edu.br",
        password="senha123"
    )
    Coordenador.objects.create(
        nome="Coordenador ADS",
        cpf="12345678999",
        email="ads.coord@restinga.ifrs.edu.br",
        user=user,
        curso=ads
    )

print("Script base executado com sucesso!")