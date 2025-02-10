import React, { useState } from 'react';
import { useTccContext } from '../context/TccContext';
import StatusAtual from './CardsDeStatus/StatusAtual';
import { stringify } from 'postcss';

const CardProximoPassos = ({ tccId, updateTccDetails }) => {
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
  const { status_atual, next_required_status, next_required_instrucoes, previa_opcional } = proximosPassos;

  // Formata a data da última atualização para um formato amigável
  const formattedDate = status_atual?.dataStatus ? new Date(status_atual.dataStatus).toLocaleString() : '';

  // Define os valores a serem exibidos com base no toggle
  const nextStepStatus = realizarPrevia ? "Sessão Pública de Andamento" : next_required_status;
  const nextStepInstrucoes = realizarPrevia ? "Você já pode agendar sua Sessão Pública de Andamento." : next_required_instrucoes;
  const ctaButtonText = realizarPrevia ? "Agendar Sessão Pública de Andamento" : "Agendar Sessão Pública de Defesa";

  return (
    <div className="border border-solid border-gray-300 rounded-md bg-white p-6">   
        <StatusAtual
        options={{statusAtual: status_atual.status, date: formattedDate, statusMessage: status_atual.mensagem}}
        />
    </div>
    // <div className="border border-solid border-gray-300 rounded-md bg-white p-6">
    //   {/* Cabeçalho: Última Atualização do Projeto */}
    //   <div class="bg-yellow-100/70 backdrop-blur-md shadow-lg rounded-lg p-4">
    //     <h3 className="text-xl font-semibold">Última Atualização do Projeto</h3>
    //     <div className="flex items-center justify-between mt-2">
    //       <span className="text-blue-600 font-bold">{status_atual?.status}</span>
    //       <span className="text-gray-500 text-sm">Atualizado em: {formattedDate}</span>
    //     </div>
    //     <p className="mt-2 text-gray-700">{status_atual?.mensagem}</p>
    //   </div>

    //   {/* Corpo: Próxima Etapa */}
    //   <div className="mb-4">
    //     <h4 className="text-lg font-medium">Próxima Etapa</h4>
    //     <div className="mt-2">
    //       <span className="text-green-600 font-bold">{nextStepStatus}</span>
    //       <p className="mt-1 text-gray-700">{nextStepInstrucoes}</p>
    //     </div>
    //   </div>

    //   {/* Toggle para Sessão Pública de Andamento, quando a sessão prévia for opcional */}
    //   {previa_opcional && (
    //     <div className="flex items-center mb-4">
    //       <input
    //         type="checkbox"
    //         id="togglePrevia"
    //         className="mr-2"
    //         checked={realizarPrevia}
    //         onChange={(e) => setRealizarPrevia(e.target.checked)}
    //       />
    //       <label
    //         htmlFor="togglePrevia"
    //         className="text-gray-700 text-sm cursor-pointer"
    //         title={`No curso ${tccData?.curso?.nome}, a realização de Sessão Pública de Andamento é opcional e não reprovatória. Você pode optar por apresentar seu progresso e recolher feedback sobre o que está adequado e o que não está.`}
    //       >
    //         Desejo Realizar Sessão Pública de Andamento
    //       </label>
    //     </div>
    //   )}

    //   {/* Rodapé: Botão de CTA */}
    //   <div>
    //     <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    //       {ctaButtonText}
    //     </button>
    //   </div>
    // </div>
  );
};

export default CardProximoPassos;
