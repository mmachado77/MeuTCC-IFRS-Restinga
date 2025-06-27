
### 👁️ VISITANTE

**V-001**\
**Como** um visitante,\
**Quero** visualizar as próximas defesas agendadas,\
**Para que** eu possa acompanhar os TCCs que acontecerão em breve.

**V-002**\
**Como** um visitante,\
**Quero** visualizar os detalhes de uma defesa agendada,\
**Para que** eu possa conhecer o tema, o autor, o orientador e os membros da banca.

**V-003**\
**Como** um visitante,\
**Quero** visualizar uma lista de trabalhos prontos aprovados,\
**Para que** eu possa consultar projetos já concluídos e disponíveis na biblioteca.

**V-004**\
**Como** um visitante,\
**Quero** visualizar os detalhes de um trabalho pronto,\
**Para que** eu conheça as informações básicas como tema, autor e orientador.

> 🔒 *Nota: os detalhes são limitados, sem acesso a documentos ou informações restritas.*

---

### 👤 USUÁRIO (DESLOGADO)

**U-001**\
**Como** um usuário não autenticado,\
**Quero** acessar a página de login,\
**Para que** eu possa iniciar o processo de autenticação com minha conta institucional.

**U-002**\
**Como** um usuário não autenticado,\
**Quero** autenticar com minha conta Google institucional (@restinga.ifrs.edu.br),\
**Para que** eu possa prosseguir para o sistema (ou cadastro, se for meu primeiro acesso).

> 🔐 *Apenas usuários com e-mail @restinga.ifrs.edu.br conseguem acessar o sistema nos testes.*

**U-003**\
**Como** um novo usuário autenticado via Google,\
**Quero** preencher meus dados pessoais,\
**Para que** eu possa concluir o cadastro no sistema.

> 🧪 *Se o testador desejar simular um novo tipo de perfil (ex: mudar de Estudante para Coordenador), será necessário apagar o banco de dados e repopular o sistema, pois o tipo é vinculado ao e-mail institucional e não pode ser alterado após o cadastro.*

**U-004**\
**Como** um novo usuário autenticado,\
**Quero** escolher meu tipo de perfil (Estudante, Professor ou Coordenador),\
**Para que** eu receba as permissões e funcionalidades adequadas.

**U-005**\
**Como** um novo usuário autenticado,\
**Quero** visualizar o formulário com campos adicionais de acordo com meu tipo de perfil,\
**Para que** eu possa preencher corretamente as informações exigidas para Estudante, Professor ou Coordenador.

> 📄 *Exemplo: Estudante → Matrícula e CPF; Professor → Título, área de atuação; Coordenador → similar ao Professor, mas com permissão extra após aprovação.*

---

### 🛠️ SUPERADMINISTRADOR

**S-001**\
**Como** Superadmin,\
**Quero** acessar a página de login administrativa (`/superadmin/login`),\
**Para que** eu possa gerenciar os dados globais do sistema.

**S-002**\
**Como** Superadmin,\
**Quero** adicionar um novo curso,\
**Para que** o sistema passe a permitir cadastros e TCCs associados a ele.

**S-003**\
**Como** Superadmin,\
**Quero** editar informações de qualquer curso,\
**Para que** eu possa manter os dados atualizados.\
> ℹ️ *Inclui nome do curso, regra de sessão pública, descrição, visibilidade...*

**S-004**\
**Como** Superadmin,\
**Quero** apontar um novo coordenador para um curso,\
**Para que** o sistema reflita corretamente a gestão do curso.\
> 💡 *Apenas contas COORDENADOR podem ser apontadas dessa maneira. Para interagir como Coordenador de um curso (aceitar propostas, editar prazo de propostas, etc...) é necessário logar com a conta de Coordenador.*

**S-005**\
**Como** Superadmin,\
**Quero** tornar um curso invisível,\
**Para que** ele não apareça como opção durante o cadastro de novos alunos.\
> ⚠️ *Cursos invisíveis continuam no banco, mas ficam ocultos na interface de cadastro. É como ativar/desativar o curso.*

**S-006**\
**Como** Superadmin,\
**Quero** visualizar a lista de todos os usuários do sistema,\
**Para que** eu possa consultar ou auditar perfis.

**S-007**\
**Como** Superadmin,\
**Quero** visualizar cadastros de professores pendentes de aprovação,\
**Para que** eu possa validar as informações e permitir o acesso ao sistema.\
> 📅 *Após aprovação, os professores ficam disponíveis para vínculo em cursos e outras interações. Somente esse fluxo conclui o cadastro de um professor.*

**S-008**\
**Como** Superadmin,\
**Quero** relacionar professores a cursos,\
**Para que** esses usuários possam aparecer como opção de orientador, banca, etc...\
> 📘 *Necessário para que o sistema entenda que o Professor X participa (pode ser orientador e membro de banca) do curso Y. É possível participar de mais de um curso.*

**S-009**\
**Como** Superadmin,\
**Quero** cadastrar novos semestres no sistema,\
**Para que** o Sistema adeque-se ao calendário acadêmico.\
> 🗓️ *Muitas funcionalidades do sistema dependem de um semestre ativo (a data atual precisa estar entre o início e fim de um semestre).*

**S-010**\
**Como** Superadmin,\
**Quero** visualizar a lista de todos os semestres cadastrados,\
**Para que** eu possa manter o controle e evitar duplicações.

**S-011**\
**Como** Superadmin,\
**Quero** visualizar qual é o semestre atual,\
**Para que** eu saiba qual ciclo está ativo no sistema.\
> 🔄 *Este valor impacta permissões e validações de data para submissão e agendamento de TCCs.*

---

### 🧑‍🎓 ESTUDANTE

#### `/sugestoes-temas-tcc`

- Visualiza **lista de sugestões de temas** cadastradas por professores do **seu curso**.

#### `/meus-tccs`

- Visualiza seus próprios TCCs (atuais e passados).
- Se **não tiver TCC ativo**:
  - Exibe botão **“Submeter Proposta”**, se o prazo estiver aberto.
  - Exibe mensagem de aviso, se o prazo estiver fechado.

#### `/submeter-proposta`  
*(rota acessível **somente** se o aluno **não tiver TCC ativo** e o **prazo de submissão estiver aberto**)*

- **Preencher formulário de proposta de TCC**, contendo:
  - **Tema do TCC** *(obrigatório)*
  - **Resumo da proposta** *(obrigatório)*
  - **Orientador** *(obrigatório)*  
    > Apenas **professores internos do curso** aparecem como opção.
  - **Checkbox obrigatório:**  
    > "Afirmo que conversei presencialmente com o professor sobre minha proposta de TCC"
  - **Coorientador** *(opcional)*  
    > Pode ser:
    > - Professor interno do curso (exceto o já escolhido como orientador)  
    > - Professor externo **vinculado** ao curso

- **Submeter a proposta**
  - Executa a ação de envio do formulário preenchido.
  - **Consequências automáticas:**
    - Um novo **TCC é criado no sistema** com o status: *Proposta em Análise pelo Orientador*.
    - É disparada uma **notificação automática** para o professor escolhido como orientador.

#### `/detalhes-tcc/[id]`

- **Visualizar resumo do TCC**:
  - Exibe: tema, autor, curso, orientador, coorientador (se houver), semestre e data de submissão.

- **Editar tema e resumo do TCC**:
  - Permite alterar diretamente os campos de tema e resumo do TCC.

- **Visualizar campo de arquivo do TCC**:
  - Se **não houver arquivo**, permite adicionar o documento inicial.
  - Se **houver arquivo**, permite:
    - Atualizar o arquivo.
    - Baixar o arquivo.
    - Excluir o arquivo.

- **Visualizar "Próximos Passos"**:
  - Exibe instruções ou chamadas para ação (CTA) dependendo do status atual do TCC.
  - *Exemplo: "Aguarde que o Coordenador do Curso avalie sua proposta."*

- **Visualizar status do TCC**:
  - Exibe o **status atual**, uma **explicação contextual**, a **data da última atualização** e um **checklist de requisitos** associados à etapa.

- **Visualizar histórico de status**:
  - Ao clicar na **tag/label do status atual**, é exibido o **histórico completo de alterações de status** do TCC.

- **Agendar Sessão Pública de Andamento (Sessão Prévia)**:
  - A funcionalidade só fica disponível **após a aprovação da proposta pelo coordenador**.
  - A exibição depende da **regra configurada no curso**:
    - Se a sessão prévia for **OBRIGATÓRIA**, o botão de agendamento aparece automaticamente.
    - Se for **OPCIONAL**, o aluno precisa **ativar manualmente um switch** para exibir a opção de agendamento.

  - **Preenchimento do formulário**:
    - Todos os campos são obrigatórios:
      - **Data da Sessão**
      - **Horário**
      - **Local**
      - **Modalidade** (Presencial ou Remota)
      - **Avaliador 1**
      - **Avaliador 2**
    - O sistema **valida automaticamente** filtra o segundo avaliador para que o mesmo professor não seja escolhido como Avaliador 1 e Avaliador 2.
    - Após preencher todos os campos válidos:
      - É exibido um **resumo visual dos dados** (Data, Hora, Local e Banca).
      - Um botão **"Confirmar Sessão"** fica disponível para envio.
    - **Consequências automáticas:**
      - O status do TCC é atualizado para: *Sessão Prévia em Análise pelo Orientador*.

- **Agendar Sessão Final (Defesa Pública)**:
  - A funcionalidade só fica disponível **após a aprovação da proposta pelo coordenador**.
  - A exibição depende da **regra de Sessão Prévia configurada no curso**:
    - Se a sessão prévia for **OBRIGATÓRIA**, a opção de agendamento só aparece **após a sessão ser aprovada** (status *Prévia OK*).
    - Se a sessão prévia for **OPCIONAL** ou estiver **desabilitada**, o botão de agendamento aparece diretamente após a aprovação da proposta.

  - **Preenchimento do formulário**:
    - Todos os campos são obrigatórios:
      - **Data da Sessão**
      - **Horário**
      - **Local**
      - **Modalidade** (Presencial ou Remota)
      - **Avaliador 1**
      - **Avaliador 2**
    - O sistema **valida automaticamente** e filtra o segundo avaliador para evitar seleção duplicada com o primeiro.
    - Após preencher todos os campos válidos:
      - É exibido um **resumo visual dos dados** (Data, Hora, Local e Banca).
      - Um botão **"Confirmar Sessão"** fica disponível para envio.

  - **Consequências automáticas:**
    - O status do TCC é atualizado para: *Sessão Final em Análise pelo Orientador*.


  - **Adicionar arquivo de sessão**:
    - Basta atualizar o documento do tcc com uma sessão agendada

  - **Ver feedback de sessão prévia**:
    - Após avaliação
---

### 👨‍🏫 PROFESSOR

#### `/meus-tccs`

- Acessa o painel com os TCCs em que está envolvido como:
  - Orientador
  - Coorientador
  - Avaliador

#### `/sugestoes-temas-tcc`

- Visualiza lista de sugestões de temas de **todos os cursos**.
- **Gerencia suas sugestões**:
  - Editar
  - Excluir
- **Adiciona nova sugestão**:
  - Pode escolher **para qual curso** ela se aplica.

#### `/proposta-pendente`

- **Visualizar lista de propostas de orientação pendentes**:
  - Lista todas as propostas de TCC que foram submetidas por estudantes e que aguardam aprovação do professor como orientador.

- **Aceitar convite de orientação**:
  - Confirma que o professor aceita orientar o aluno naquele TCC.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para: *Proposta em Análise pelo Coordenador*.
    - Uma notificação é enviada ao **Coordenador do Curso**, sinalizando que a proposta foi aceita pelo orientador.

- **Recusar convite de orientação**:
  - O professor deve fornecer uma **justificativa obrigatória** para recusar.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para: *Proposta Recusada pelo Orientador*.
    - O TCC é considerado **reprovado** e sai do fluxo ativo.

- **Visualizar quantidade de orientações ativas e limite permitido**:
  - Exibe quantos TCCs o professor está orientando no momento.
  - Mostra qual é o **limite máximo de orientações simultâneas**, conforme definido pelo curso.

#### `/sessoes-futuras-orientador`

- **Visualizar lista de sessões (Prévia ou Final)**:
  - Lista apenas as sessões futuras dos TCCs em que o professor atua como **orientador**.

- **Visualizar detalhes de uma sessão da lista**:
  - Permite consultar data, horário, local, modalidade e composição da banca.

- **Editar dados da sessão**:
  - Pode alterar:
    - Todos os dados da sessão.

- **Confirmar sessão**:
  - Declara que o orientador está de acordo com a sessão marcada.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para:
      - *Sessão Prévia em Análise pelo Coordenador* **ou**
      - *Sessão Final em Análise pelo Coordenador*, conforme o caso.
    - A sessão passa a **aparecer na página inicial pública** como agendamento futuro.

#### `/detalhes-tcc/[id]` (visão do Professor)

##### Quando o professor é **avaliador** (sessão prévia):

- **Baixar documento do TCC**
- **Baixar documento da sessão**
- **Avaliar sessão prévia**:
  > - DICA: Para que seja possível avaliar, a data do servidor precisa ser maior que a do agendamento
  >
  > - Crie um SuperAdmin no Django e altere a data da sessão **OU** Edite após agendamento como Coordenador do Curso
  - Permite inserir **comentários textuais** sobre a sessão avaliada.
  - A submissão dessa avaliação não altera o status do TCC.
- **Visualizar comentários da sessão prévia**:
  - Exibe os próprios comentários realizados anteriormente, caso a sessão já tenha sido avaliada.

##### Quando o professor é **orientador** (sessão prévia):

- **Baixar documento do TCC**
- **Baixar documento da sessão**
- **Avaliar sessão prévia**:
  - Só fica disponível **após os outros avaliadores** terem enviado suas avaliações.
  - Permite:
    - Inserir comentários próprios sobre a sessão;
    - Escolher se a Sessão está **Aprovada** ou **Reprovada**.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para:
      - *Prévia OK* (caso aprovado)
      - *Reprovado na Sessão Prévia* (caso reprovado)

---

##### Quando o professor é **avaliador** (sessão final):

- **Baixar documento do TCC**
- **Baixar documento da sessão**
- **Preencher formulário de avaliação**
- **Adicionar considerações finais**
> - DICA: a avaliação só pode ser feita após a data e hora da sessão
- A submissão da avaliação **não altera o status** do TCC.

##### Quando o professor é **orientador** (sessão final):

- **Baixar documento do TCC**
- **Baixar documento da sessão**
- **Preencher formulário de avaliação**
- **Adicionar considerações finais**
- **Condicionar nota à ajustes**:
  - Marcar checkbox de exigência de ajustes;
  - Preencher prazo para envio da versão ajustada;
  - Detalhar as adequações necessárias.
- **Validar ou recusar ajustes feitos pelo aluno**:
  - Após o reenvio do documento ajustado, o orientador pode:
    - **Aprovar os ajustes** e finalizar o TCC com status *Aprovado*;
    - **Recusar os ajustes**, resultando no status *Reprovado na Sessão Final*.
- **Baixar avaliação**
- **Anexar ficha de avaliação assinada**



---

### 🧑‍🏫 COORDENADOR DE CURSO

#### `/superadmin/dashboard` *(ao acessar como Coordenador do próprio curso)*

- **Editar detalhes do meu curso:**
  - Edita informações básicas.
  - Aponta novo coordenador.  
    > Apenas para relacionamento com professor. Registrar Coordenador em TCCs do curso, etc.  
    > **⚠️ Não é possível gerenciar o curso pela conta de professor apontada como Coordenador.**
  - Abre ou fecha prazo de envio de propostas.
  - Relaciona ou desvincula professores do curso.

- **Alterar visibilidade do curso:**
  - Se o curso estiver marcado como **invisível**, ele **não aparece como opção no cadastro** de novos alunos.

#### `/proposta-pendente`

- **Visualizar lista de propostas de TCC pendentes da minha aprovação**:
  - Lista apenas as **propostas que já foram aceitas** pelo professor orientador indicado.

- **Visualizar quantidade de orientações ativas do orientador da proposta**:
  - Para cada proposta listada, exibe:
    - Quantidade atual de TCCs em que o professor indicado atua como orientador.
    - Limite máximo permitido pelo curso.
  - Útil para tomada de decisão ao aprovar ou não uma nova orientação.

- **Aprovar proposta de TCC**:
  - Confirma que a proposta foi validada pelo coordenador e está apta a iniciar a fase de desenvolvimento.
  - Se o orientador indicado **ultrapassar o limite de orientações com essa proposta**, o sistema exibe um **aviso de extrapolação**.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para: *TCC em Desenvolvimento*.
    - Uma notificação é enviada ao aluno autor do TCC.

- **Recusar proposta de TCC**:
  - O coordenador deve fornecer uma **justificativa obrigatória** para recusar.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para: *Proposta Recusada pelo Coordenador*.
    - O TCC é considerado **reprovado** e sai do fluxo ativo.

#### `/sessoes-futuras`

- **Visualizar lista de sessões (Prévia ou Final)**:
  - Lista todas as sessões futuras de TCCs do **curso sob responsabilidade do coordenador**.

- **Visualizar detalhes de uma sessão da lista**:
  - Permite consultar os dados completos da sessão, inclusive histórico de alterações.

- **Editar dados da sessão**:
  - Pode modificar qualquer campo do agendamento (inclusive após confirmação do orientador).

- **Agendar sessão**:
  - Ao confirmar a sessão como coordenador:
    - A sessão é considerada **oficialmente marcada**.
  - **Consequências automáticas:**
    - O status do TCC é atualizado para:
      - *Sessão Prévia Agendada* **ou**
      - *Sessão Final Agendada*.
    - A sessão passa a ficar **bloqueada para edição pelo orientador**.

#### `/detalhes-tcc/[id]` *(visão do Coordenador de Curso)*

- **Alterar orientador e coorientador do TCC**:
  - Permite selecionar um novo **orientador** entre os professores internos vinculados ao curso.
  - Permite selecionar um novo **coorientador** entre:
    - Professores internos do curso (exceto o orientador já indicado),
    - Professores externos vinculados ao curso.
  - Permite remover um **coorientador**
