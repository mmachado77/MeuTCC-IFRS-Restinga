const getClassForStatus = (status) => {
  switch (status) {
    case 'PROPOSTA_ANALISE_PROFESSOR':
      return {status: 'Análise Orientador', cor: '#FFBF00'};
    case 'PROPOSTA_RECUSADA_PROFESSOR':
      return {status: 'Proposta Recusada pelo Orientador', cor: '#D2222D'};
    case 'PROPOSTA_ANALISE_COORDENADOR':
      return {status: 'Análise Coordenador', cor: '#FFBF00'};
    case 'PROPOSTA_RECUSADA_COORDENADOR':
      return {status: 'Proposta Recusada pelo Coordenador', cor: '#D2222D'};
    case 'DESENVOLVIMENTO':
    case 'PREVIA_OK':
      return {status: 'Desenvolvimento', cor: '#3b82f6'};
    case 'PREVIA_ORIENTADOR':
      return {status: 'Sessão Prévia em Análise do Orientador', cor: '#FFBF00'};
    case 'PREVIA_COORDENADOR':
      return {status: 'Sessão Prévia em Análise do Coordenador', cor: '#FFBF00'};
    case 'PREVIA_AGENDADA':
      return {status: 'Prévia Agendada', cor: '#3b82f6'};
    case 'REPROVADO_PREVIA':
      return {status: 'Reprovado na Sessão Prévia', cor: '#D2222D'};
    case 'FINAL_ORIENTADOR':
      return {status: 'Sessão Final em Análise do Orientador', cor: '#FFBF00'};
    case 'FINAL_COORDENADOR':
      return {status: 'Sessão Final em Análise do Coordenador', cor: '#FFBF00'};
    case 'FINAL_AGENDADA':
      return {status: 'Sessão Final Agendada', cor: '#FFBF00'};
    case 'REPROVADO_FINAL':
      return {status: 'Reprovado na Sessão Final', cor: '#D2222D'};
    case 'AJUSTE':
      return {status: 'TCC em Fase de Ajuste', cor: '#3b82f6'};
    case 'APROVADO':
      return {status: 'TCC Aprovado', cor: '#007000'};
    default:
      return {status: 'Desconhecido', cor: '#808080'};
  }
};

export default getClassForStatus;
