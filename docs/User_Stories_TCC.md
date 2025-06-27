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

### 🧑‍🎓 ESTUDANTE

**E-001**  
**Como** estudante,  
**Quero** visualizar sugestões de temas do meu curso,  
**Para que** eu possa escolher um tema relevante para meu TCC.  
> 🔎 Rota: `/sugestoes-temas-tcc`  
> 🎯 Lista apenas sugestões de professores do mesmo curso.

**E-002**  
**Como** estudante,  
**Quero** visualizar meus TCCs ativos ou passados,  
**Para que** eu possa acompanhar minha trajetória acadêmica.  
> 🔎 Rota: `/meus-tccs`  
> 🧪 Exibe botão “Submeter Proposta” se o prazo estiver aberto.

**E-003**  
**Como** estudante,  
**Quero** submeter uma proposta de TCC,  
**Para que** eu possa iniciar oficialmente meu projeto.  
> 🔎 Rota: `/submeter-proposta`  
> ✏️ Formulário exige tema, resumo, orientador e aceite formal.  
> ✅ Gera TCC com status *Proposta em Análise pelo Orientador*.

**E-004**  
**Como** estudante,  
**Quero** editar o tema, resumo e arquivo do meu TCC,  
**Para que** eu possa manter as informações sempre atualizadas.  
> 🔎 Rota: `/detalhes-tcc/[id]`  
> 🧪 Permite gerenciar o arquivo e visualizar o histórico de status.

**E-005**  
**Como** estudante,  
**Quero** acompanhar meus “próximos passos” no TCC,  
**Para que** eu saiba exatamente o que devo fazer em cada fase.  
> 🔎 Disponível em `/detalhes-tcc/[id]`, com checklist por status.

**E-006**  
**Como** estudante,  
**Quero** agendar a Sessão de Prévia, quando exigida,  
**Para que** eu possa apresentar o andamento do meu trabalho.  
> 🔎 Rota: `/detalhes-tcc/[id]`  
> ✅ Condicional: depende da regra configurada no curso.  
> ✏️ Campos obrigatórios: data, horário, local, modalidade e banca.

**E-007**  
**Como** estudante,  
**Quero** agendar a Sessão Final,  
**Para que** eu possa apresentar minha defesa pública de TCC.  
> 🔎 Rota: `/detalhes-tcc/[id]`  
> 🔄 Liberada conforme status e regras da Sessão Prévia.

**E-008**  
**Como** estudante,  
**Quero** visualizar comentários da banca após a sessão,  
**Para que** eu entenda os pontos de melhoria do meu trabalho.  
> ✅ Exibido após a data da sessão e envio das avaliações.

**E-009**  
**Como** estudante,  
**Quero** reenviar a versão ajustada do TCC quando solicitado,  
**Para que** meu orientador possa validar as correções e aprovar.  
> 🔄 Após sessão final com ajustes, reenvio do arquivo substitui o anterior.

---

### 👨‍🏫 PROFESSOR

**P-001**  
**Como** professor,  
**Quero** visualizar todos os TCCs em que atuo,  
**Para que** eu possa acompanhar os projetos sob minha responsabilidade.  
> 🔎 Rota: `/meus-tccs`  
> 👥 Inclui orientações, coorientações e bancas.

**P-002**  
**Como** professor,  
**Quero** cadastrar sugestões de tema,  
**Para que** os alunos possam ter ideias de projetos para desenvolver.  
> 🔎 Rota: `/sugestoes-temas-tcc`  
> ✏️ Permite selecionar o curso ao qual a sugestão se aplica.

**P-003**  
**Como** professor,  
**Quero** aceitar ou recusar uma proposta de orientação,  
**Para que** eu controle minha carga de orientação.  
> 🔎 Rota: `/proposta-pendente`  
> ✅ Aceite muda status para *Análise pelo Coordenador*; recusa exige justificativa.

**P-004**  
**Como** professor,  
**Quero** visualizar e confirmar sessões de TCC em que sou orientador,  
**Para que** eu possa validar os dados e permitir agendamento oficial.  
> 🔎 Rota: `/sessoes-futuras-orientador`  
> ✏️ Sessões confirmadas vão para análise do coordenador.

**P-005**  
**Como** professor,  
**Quero** avaliar sessões de TCC em que sou banca,  
**Para que** eu possa registrar minha análise sobre o trabalho apresentado.  
> ✅ Sessão precisa já ter ocorrido (verificada pela data).  
> ✍️ Comentários ou ficha são obrigatórios conforme tipo de sessão.

**P-006**  
**Como** professor,  
**Quero** preencher a ficha de avaliação final,  
**Para que** o sistema possa gerar a versão oficial a ser assinada.

**P-007**  
**Como** professor,  
**Quero** anexar a ficha assinada da avaliação final,  
**Para que** o processo seja concluído com os documentos formais.

**P-008**  
**Como** professor,  
**Quero** solicitar ajustes ao TCC após a sessão final,  
**Para que** o aluno tenha prazo para corrigir e reenviar.  
> ✏️ Permite indicar prazo e instruções detalhadas.

**P-009**  
**Como** professor,  
**Quero** validar ou recusar a versão ajustada enviada pelo aluno,  
**Para que** o sistema finalize o TCC com status *Aprovado* ou *Reprovado na Sessão Final*.

---

### 🧑‍🏫 COORDENADOR DE CURSO

**C-001**  
**Como** coordenador,  
**Quero** aprovar ou recusar propostas de TCC,  
**Para que** apenas projetos viáveis avancem para a fase de desenvolvimento.  
> 🔎 Rota: `/proposta-pendente`  
> ✏️ Requere justificativa em caso de recusa.

**C-002**  
**Como** coordenador,  
**Quero** acompanhar a carga de orientações dos professores,  
**Para que** eu possa aprovar propostas sem ultrapassar os limites definidos.

**C-003**  
**Como** coordenador,  
**Quero** agendar e editar sessões de TCC,  
**Para que** eu possa garantir que todas as defesas sejam realizadas corretamente.  
> 🔎 Rota: `/sessoes-futuras`  
> ✅ Após sua aprovação, a sessão fica bloqueada para edições externas.

**C-004**  
**Como** coordenador,  
**Quero** alterar orientador e coorientador de um TCC,  
**Para que** seja possível corrigir desvios ou ajustes administrativos.  
> 🔎 Rota: `/detalhes-tcc/[id]`  
> ✏️ Apenas professores vinculados ao curso podem ser selecionados.

**C-005**  
**Como** coordenador,  
**Quero** editar os dados do meu curso,  
**Para que** eu possa manter atualizada sua configuração, prazos e docentes.

**C-006**  
**Como** coordenador,  
**Quero** definir se a Sessão Prévia é obrigatória, opcional ou desativada,  
**Para que** o sistema se adeque ao fluxo do meu curso.

**C-007**  
**Como** coordenador,  
**Quero** indicar um novo coordenador do curso,  
**Para que** a gestão do sistema reflita corretamente as mudanças de coordenação.

**C-008**  
**Como** coordenador,  
**Quero** visualizar e aprovar fichas de avaliação e sessões futuras,  
**Para que** o processo de defesa seja oficialmente registrado e encerrado.
