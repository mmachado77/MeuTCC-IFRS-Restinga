import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import { ScrollPanel } from 'primereact/scrollpanel';

const ComentariosTabView = ({ orientador, avaliador1, avaliador2, avaliacao }) => {
  
  // Função para retornar uma versão resumida do nome completo.
  const getShortName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1]}`;
  };

  // Obter os comentários (com fallback para string vazia)
  const orientadorComment = avaliacao?.comentarios_orientador || "";
  const avaliador1Comment = avaliacao?.comentarios_avaliador1 || "";
  const avaliador2Comment = avaliacao?.comentarios_avaliador2 || "";

  const orientadorAjusteText = `${avaliacao?.descricao_ajuste || ""}

  -----------------------
  
  Comentários Avaliador:
  ${avaliacao?.comentarios_orientador || ""}`;

  // Templates para os cabeçalhos das abas
  const orientadorHeaderTemplate = (options) => (
    <div
      className="flex justify-between gap-2 p-3 items-center rounded-t-xl"
      style={{
        cursor: 'pointer',
        color: options.selected ? '#f97316' : 'inherit',
        backgroundColor: options.selected ? ' #fff2e2b3' : ''
      }}
      onClick={options.onClick}
    >
      <Avatar image={orientador?.avatar} shape="circle" />
      <div className="text-start text-[0.9rem]">
        <span className="font-bold">{getShortName(orientador?.nome)}</span>
        <span className="block">Orientador</span>
      </div>
    </div>
  );

  const avaliador1HeaderTemplate = (options) => (
    <div
      className="flex justify-between gap-2 p-3 items-center rounded-t-xl"
      style={{
        cursor: 'pointer',
        color: options.selected ? '#f97316' : 'inherit',
        backgroundColor: options.selected ? ' #fff2e2b3' : ''
      }}
      onClick={options.onClick}
    >
      <Avatar image={avaliador1?.avatar} shape="circle" />
      <div className="text-start text-[0.9rem]">
        <span className="font-bold">{getShortName(avaliador1?.nome)}</span>
        <span className="block">Membro da Banca</span>
      </div>
    </div>
  );

  const avaliador2HeaderTemplate = (options) => (
    <div
      className="flex justify-between gap-2 p-3 items-center rounded-t-xl"
      style={{
        cursor: 'pointer',
        color: options.selected ? '#f97316' : 'inherit',
        backgroundColor: options.selected ? ' #fff2e2b3' : ''
      }}
      onClick={options.onClick}
    >
      <Avatar image={avaliador2?.avatar} shape="circle" />
      <div className="text-start text-[0.9rem]">
        <span className="font-bold">{getShortName(avaliador2?.nome)}</span>
        <span className="block">Membro da Banca</span>
      </div>
    </div>
  );

  return (
    <div>
      <TabView pt={{
        nav: { className: 'justify-start items-center border-none' },
        panelContainer:{ className: 'p-0'}
        }}>
        <TabPanel
        contentClassName='border-solid border border-[#f97316] rounded-md w-full p-4'
        headerTemplate={orientadorHeaderTemplate}>
            <div className='text-[1.15rem]' style={{ whiteSpace: 'pre-line'}}>
            <span className='block font-semibold'>Pontos a serem Corrigidos:</span>
              {orientadorAjusteText}
            </div>
        </TabPanel>
        <TabPanel
        contentClassName='border-solid border border-[#f97316] rounded-md w-full p-4'
        headerTemplate={avaliador1HeaderTemplate}>
            <div className='text-[1.15rem]' style={{ whiteSpace: 'pre-line' }}>
            <span className='block font-semibold'>Comentários:</span>
              {avaliador1Comment}
            </div>
        </TabPanel>
        <TabPanel
        contentClassName='border-solid border border-[#f97316] rounded-md w-full p-4'
        headerTemplate={avaliador2HeaderTemplate}>
            <div className='text-[1.15rem]' style={{ whiteSpace: 'pre-line' }}>
              <span className='block font-semibold'>Comentários:</span>
              {avaliador2Comment}
            </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default ComentariosTabView;
