import React from 'react';
import { useTccContext } from 'meutcc/pages/detalhes-tcc/context/TccContext';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import ComentariosTabView from './ComentariosTabView';
import FileItemAjuste from './FileItemAjuste';

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const dateObj = new Date(isoDate);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear()).slice(-2);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `Dia ${day}/${month}/${year}, às ${hours}:${minutes}`;
};

const Ajuste = () => {
  const { tccData } = useTccContext();
  const sessao = tccData?.sessoes?.find(sessao => sessao.resourcetype === "SessaoFinal");
  const av1 = sessao?.banca?.professores[0]
  const av2 = sessao?.banca?.professores[1]
  const avaliacao = sessao?.avaliacao;

  return (
    <div className="w-full">
      {/* Card principal */}

        {/* Conteúdo em duas colunas */}
        <div className="flex pt-4 pb-10 gap-4">

          <div className="flex text-center justify-around gap-6">

            {/* ESQUERDA: AÇÃO */}
            <div className="flex flex-col max-w-[40%] px-2 border border-dashed border-[#f97316] rounded-md shadow-md">

              {/* Tag Ajustes */}
              <div className="self-center px-2 -mt-[1rem]">
                <Tag
                icon='pi pi-file-pdf text-lg ml-2'
                  className="h-fit text-[0.95rem] gap-2 px-4 font-semibold"
                  value="TCC Ajustado"
                  severity="warning"
                />
              </div>

              <div className='flex flex-col h-full justify-center py-2'>
                {/* Campo do Arquivo */}
                  <FileItemAjuste />
              </div>

            </div>

            {/* DIREITA: MENSAGEM */}
            <div className='w-[60%] rounded-lg border border-dashed border-[#ef4444] rounded-md shadow-md'>
              <div className="justify-center items-center py-3 gap-2 rounded-lg" >
              <div className='bg-[#ffe2e2b3] bg-checklist-gradient py-2 w-full mt-2'>
                    <span className="block font-bold text-[1.4rem] text-[#ef4444]">ATENÇÃO</span>
                    </div>
                <div className="pt-2">
                  <div className="w-full px-4 pt-2 text-center flex flex-col gap-3">
                    <span className="text-[1rem] text-[#ef4444]">
                      Esse TCC foi avaliado pela Banca Examinadora e sua aprovação está condicionada à realização dos ajustes solicitados pela Banca.
                    </span>
                    <div className="block text-[1rem] text-[#ef4444]">
                      <span>Prazo para envio:</span>
                      <span className="block font-bold">{formatDate(avaliacao?.data_entrega_ajuste)}.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ABAIXO: Ajustes solicitados */}
        <div className="flex flex-col items-end w-full h-fit border border-dashed border-[#f97316] rounded-md shadow-md pb-8 pt-12 px-6">
          <div className="items-center -mt-[4.2rem]">
            <Tag
              className="h-fit text-[1.1rem] px-4 font-semibold"
              value="Ajustes Solicitados"
              severity="warning"
            />
          </div>
          {/* Ajuste Orientador */}
          <div className='w-full pt-2 '>
            <ComentariosTabView orientador={tccData?.orientador} avaliador1={av1} avaliador2={av2} avaliacao={avaliacao} />
          </div>
        </div>
      </div>

  );
};

export default Ajuste;
