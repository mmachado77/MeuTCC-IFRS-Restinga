const getClassForStatus = (status) => {
    switch (status) {
      case 'PROPOSTA_ANALISE_PROFESSOR':
      case 'PROPOSTA_ANALISE_COORDENADOR':
      case 'DESENVOLVIMENTO':
      case 'PREVIA':
      case 'FINAL':
      case 'AJUSTE':
        return {status: 'Análise', cor: '#FFBF00'};
      case 'PROPOSTA_RECUSADA_PROFESSOR':
      case 'PROPOSTA_RECUSADA_COORDENADOR':
      case 'REPROVADO_PREVIA':
      case 'REPROVADO_FINAL':
        return {status: 'Reprovado', cor: '#D2222D'};
      case 'APROVADO':
        return {status: 'Reprovado', cor: '#007000'};
      default:
    }
};

export default getClassForStatus;