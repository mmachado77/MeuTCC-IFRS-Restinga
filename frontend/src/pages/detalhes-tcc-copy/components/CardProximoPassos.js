import React, { useState } from 'react';
import { useTccContext } from '../context/TccContext';
import StatusAtual from './CardsDeStatus/StatusAtual';
import statusMapping from 'meutcc/core/utils/statusMapping';
import ProximaEtapa from './CardsDeStatus/ProximaEtapa';

const CardProximoPassos = ({ tccId, isEditable, fileItemRef }) => {
  const { tccData, proximosPassos } = useTccContext();
  const [realizarPrevia, setRealizarPrevia] = useState(false);

  // Se os dados ainda não foram carregados, exibe uma mensagem de loading.
  if (!proximosPassos) {
    return (
      <div className="border border-solid border-gray-300 rounded-md bg-white p-6">
        Carregando próximos passos...
      </div>
    );
  }

  // Extrai os dados do objeto retornado pela API
  const { status_atual, previa_opcional, cta, checklist } = proximosPassos;

  // Formata a data da última atualização para um formato amigável
  const formattedDate = status_atual?.dataStatus
    ? new Date(status_atual.dataStatus).toLocaleString()
    : '';

  return (
    <div className="border border-solid border-gray-300 rounded-md h-full flex flex-col justify-around bg-white px-6 pb-6">
      <StatusAtual
        props={{
          statusAtual: statusMapping[status_atual.status],
          date: formattedDate,
          statusMessage: status_atual.mensagem,
          checklist: checklist
        }}
        historicoStatus={tccData?.status}
        mostrarTimeline={isEditable}
        reprovado={tccData?.cancelado}
      />
      {(!tccData?.concluido || !tccData?.autorizacaoPublicacao) && (
        <ProximaEtapa
          key={status_atual?.dataStatus} // Força a remontagem quando os dados mudarem
          props={{
            previaOpcional: previa_opcional,
            instrucoes: status_atual?.instrucoes,
            cta: cta,
            valor: cta?.valor
          }}
          fileItemRef={fileItemRef}
        />
      )}
    </div>
  );
};

export default CardProximoPassos;
