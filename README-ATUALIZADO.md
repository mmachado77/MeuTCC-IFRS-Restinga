# 📘 Sistema de Gerenciamento de TCC

Este repositório contém o sistema completo de gerenciamento de Trabalhos de Conclusão de Curso (TCC), dividido em frontend e backend. Abaixo estão as instruções para configuração do frontend.

## 🔧 Instalação do Frontend

O frontend foi desenvolvido com Next.js, PrimeReact, TailwindCSS e outras bibliotecas modernas. Para rodar a interface localmente:

### 📁 Navegação até a pasta do frontend

Abra um terminal e execute:

```
cd frontend
```

> Certifique-se de estar na raiz do projeto (`/MeuTCC-IFRS-Restinga`) antes de rodar esse comando.

### 📦 Instalação das dependências

As dependências estão travadas via `package-lock.json`, garantindo que todos os pacotes sejam instalados nas versões testadas e seguras:

```
npm install
```

> Este comando instalará exatamente as mesmas versões utilizadas em desenvolvimento, incluindo correções de segurança aplicadas.

### 🚀 Executando o sistema em modo de desenvolvimento

Após instalar, execute:

```
npm run dev
```

O frontend estará disponível em:  
[`http://localhost:3000`](http://localhost:3000)

### 🛡️ Segurança e confiabilidade

As dependências estão livres de vulnerabilidades conhecidas, e os arquivos `package.json` e `package-lock.json` são atualizados e versionados em conjunto.  
Recomendamos não usar `npm update` ou `npm audit fix` sem revisar as alterações.

## 🔧 Instalação do Backend

O backend do sistema foi desenvolvido em Django. A seguir estão os passos necessários para rodar localmente.

---

### 📁 1. Acesse a pasta do backend

Abra um terminal e execute:

```
cd backend
```

> Certifique-se de estar na raiz do projeto (`/MeuTCC-IFRS-Restinga`) antes de rodar esse comando.

### 📦 2. Instale os pacotes necessários

Certifique-se de ter o **Python** instalado. Em seguida, instale os pacotes usados pelo sistema:

```
pip install -r requirements.txt
```

---

### ⚙️ 3. Configure as variáveis do sistema

Abra a pasta `meutcc/`, localize o arquivo `env_example_settings.py` e **duplique** ele com o nome `env_settings.py`.

Depois disso, abra o novo arquivo e substitua o valor das variáveis pelos corretos.

---

### 🧬 4. Atualize o banco de dados

Volte ao terminal e execute:

```
py manage.py makemigrations
```

Em seguida, execute:

```
py manage.py migrate
```

---

### 🌱 5. Execute o script inicial

Esse script cria dados básicos no sistema (como perfis e permissões iniciais).

1. No terminal, execute:

```
py manage.py shell
```

2. Quando abrir o shell interativo do Django, digite:

```python
exec(open("script_inicial.py").read())
```

Depois disso, você já pode iniciar o sistema normalmente.

### 🚀 6. Inicie o servidor

Para iniciar o backend localmente, rode:

```
py manage.py runserver
```

O sistema estará disponível em: [`http://127.0.0.1:8000`](http://127.0.0.1:8000)

---
