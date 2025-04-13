# 📘 Sistema de Gerenciamento de TCC

Este repositório contém o sistema completo de gerenciamento de Trabalhos de Conclusão de Curso (TCC), dividido em frontend e backend.

Abaixo estão as instruções para configuração do ambiente local, especialmente preparadas para testes e contribuições.

## 🔧 Instalação do Frontend

O frontend foi desenvolvido com Next.js, PrimeReact, TailwindCSS e outras bibliotecas modernas. Para rodar a interface localmente:

### 📁 Navegação até a pasta do frontend

Abra um terminal e execute:

```bash
cd frontend
```

> Certifique-se de estar na raiz do projeto (`/MeuTCC-IFRS-Restinga`) antes de rodar esse comando.

### 📦 Instalação das dependências

Em seguida, execute:

```bash
npm install
```

> Isso instalará as dependências necessárias.

### 🚀 Executando o sistema em modo de desenvolvimento

Após instalar, execute:

```bash
npm run dev
```

O frontend estará disponível em:  
[`http://localhost:3000`](http://localhost:3000)

## 🔧 Instalação do Backend

O backend foi desenvolvido em Django 5, com integração ao Google Drive, Autenticação Google e outras ferramentas.
A seguir estão os passos necessários para rodar localmente.

---

### 📁 Acesse a pasta do backend

Abra um terminal e execute:

```bash
cd backend
```

> Certifique-se de estar na raiz do projeto (`/MeuTCC-IFRS-Restinga`) antes de rodar esse comando.

### 📦 Instale as dependências

Certifique-se de ter o **Python** instalado. Em seguida, rode:

```bash
pip install -r requirements.txt
```

---

### ⚙️ Configure as variáveis do sistema

1. Abra a pasta `meutcc/`
2. Duplique o arquivo `env_example_settings.py` e renomeie como `env_settings.py`
3. Preencha todos os campos abaixo com os dados fornecidos:

```python
GOOGLE_OAUTH2_CLIENT_ID = ""
GOOGLE_OAUTH2_CLIENT_SECRET = ""
GOOGLE_OAUTH2_REDIRECT_URI = ""

AUTH_FRONTEND_URL = ""
AUTH_ERROR_FRONTEND_URL = ""

GOOGLE_OAUTH2_SCOPE = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

GOOGLE_DRIVE_OAUTH2_CLIENT_ID = ""
GOOGLE_DRIVE_OAUTH2_CLIENT_SECRET = ""
GOOGLE_DRIVE_OAUTH2_REDIRECT_URI = ""

GOOGLE_DRIVE_OAUTH2_SCOPE = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file'
]

GOOGLE_DRIVE_CREDENTIALS_JSON = '''{ ... }'''
```

---

### 🧬 Atualize o banco de dados

Volte ao terminal e execute:

```bash
py manage.py makemigrations
```

Em seguida, execute:

```bash
py manage.py migrate
```

---

### 🌱 Popule o sistema com dados de teste

Use o comando customizado incluído no projeto:

```bash
py manage.py setup_test_enviroment
```

Esse comando:

- Executa os scripts de seed com dados simulados de usuários, cursos, professores, estudantes e demais itens essenciais.

---

Depois disso, você já pode iniciar o sistema normalmente.

### 🚀 Inicie o servidor

Para iniciar o backend localmente, rode:

```bash
py manage.py runserver
```

O sistema estará disponível em: [`http://127.0.0.1:8000`](http://127.0.0.1:8000)

---

### 👨‍💻 Dúvidas ou contribuições?

Fique à vontade para abrir uma issue ou entrar em contato comigo!