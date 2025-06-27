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
