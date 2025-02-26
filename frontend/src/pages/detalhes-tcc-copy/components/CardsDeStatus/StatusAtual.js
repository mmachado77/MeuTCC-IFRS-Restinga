import React, { useState } from 'react';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Message } from 'primereact/message';
import { Tooltip } from 'primereact/tooltip';


const renderMessage = (statusMensagem, date, corFundo, primaryColor, icon, checklist) => {
  return (
    <div className="card">
      <Message
          style={{
              backgroundColor: `${corFundo}`,
              color: `${primaryColor}`,
              padding: "0.5rem",
          }}
          className="w-full justify-content-start"
          severity="success"
          content={renderMessageContent(statusMensagem, primaryColor, date, icon, checklist)}
      />
    </div>
  );
}

const renderTimelineContent = (item, index, firstNonCompletedIndex) => {
  const naoFeitoPrincipal = "#f97316";
  const feitoPrincipal = "#22c55e";

  // Define estilo base com cursor pointer
  let style = { fontSize: '1.25rem', cursor: 'pointer' };
  let icon;

  if (item.concluido) {
    icon = 'pi pi-check-circle';
    style.color = feitoPrincipal;
  } else {
    // Para itens não concluídos:
    // Se for o primeiro, inicia com spinner; caso contrário, ícone estático (exclamation-triangle)
    if (index === firstNonCompletedIndex) {
      icon = 'pi pi-spin pi-spinner';
    } else {
      icon = 'pi pi-exclamation-circle';
    }
    style.color = naoFeitoPrincipal;
  }

  const targetId = `timeline-icon-${index}`;

  // Para o primeiro item não concluído, adiciona lógica de hover
  const handleMouseEnter = (e) => {
    if (!item.concluido && index === firstNonCompletedIndex) {
      e.currentTarget.classList.remove('pi-spin', 'pi-spinner');
      e.currentTarget.classList.add('pi-exclamation-circle');
    }
  };

  const handleMouseLeave = (e) => {
    if (!item.concluido && index === firstNonCompletedIndex) {
      e.currentTarget.classList.remove('pi-exclamation-circle');
      e.currentTarget.classList.add('pi', 'pi-spin', 'pi-spinner');
    }
  };

  // Apenas adiciona os event handlers para o primeiro item não concluído
  const eventHandlers =
    !item.concluido && index === firstNonCompletedIndex
      ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
      : {};

  return (
    <div key={index}>
      <div>
        <i
          id={targetId}
          className={`icone-timeline ${icon}`}
          style={style}
          {...eventHandlers}
        ></i>
      </div>
      <Tooltip
        pt={{
          text: { style: { backgroundColor: item.concluido ? feitoPrincipal : naoFeitoPrincipal, color: 'text-gray-700' } }
        }}
        position="top"
        target={`#${targetId}`}
        className="max-w-[320px] text-[0.85rem]"
      >
        <span>{item.acao}</span>
      </Tooltip>
    </div>
  );
};

const renderChecklist = (checklist) => {
  // Identifica o índice do primeiro item não concluído
  const firstNonCompletedIndex = checklist.findIndex(item => !item.concluido);

  return (
    <div className="bg-checklist-gradient shadow-md rounded-lg border border-solid">
      <div className="text-center pt-2">
        <span className="font-semibold">Checklist do Tcc</span>
      </div>
      <Timeline
        className="p-[0.5rem]"
        pt={{
          opposite: { style: { display: 'none' } },
          content: { style: { display: 'none' } },
          event: { style: { minHeight: '0px', height: 'fit-content' } }
        }}
        value={checklist}
        layout="horizontal"
        align="top"
        marker={(item, index) =>
          renderTimelineContent(item, index, firstNonCompletedIndex)
        }
      />
    </div>
  );
};


const renderMessageContent = (statusMensagem, primaryColor, date, icon, checklist) => {
  return (
    <div className=''>
      <div className="flex items-center justify-between gap-1">
        <div className='w-1/5 flex justify-center'>
        <i className={`${icon}`} style={{ color: primaryColor, fontSize: '1.7rem' }}></i>
        </div>
        <div className='w-4/5'>
        <span className='text-[0.75rem]'>{statusMensagem}</span>
        <div>
        <span className="text-[0.75rem] text-end mb-3 italic">Última Atualização: {date}</span>
        </div>
        </div>
      </div>
      <div className='px-1 pt-3 '>
      {renderChecklist(checklist)}
      </div>
    </div>
  );
}

const StatusAtual = ({ props, historicoStatus, mostrarTimeline, reprovado }) => {
  let primaryColor = "";
  let messageColor = "";
  let icon = "";

  if(reprovado){
    primaryColor = "#ef4444";
    messageColor = "#f8e4e4b3";
    icon = "pi pi-times-circle";
  } else{
    primaryColor = "#22c55e";
    messageColor = "#e4f8f0b3";
    icon = "pi pi-check-circle";
  }
  
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);

  return (
    <div className={`card flex flex-col px-4 mt-6 border border-dashed rounded-md shadow-md`}
    style={{ borderColor: primaryColor }}>
      {/* Cabeçalho: Última Atualização do Projeto */}
      <div className="">
        <div className='text-start -mt-[0.85rem]'>
          <Tag
            className='h-fit text-[0.85rem] font-semibold'
            value={props?.statusAtual}
            style={{ backgroundColor: `${primaryColor}`, color: '#FFFFFF', cursor: mostrarTimeline ? 'pointer' : 'default' }}
            onClick={() => mostrarTimeline && setIsTimelineVisible(true)}
          />
        </div>
        <div className="flex items-center justify-between mb-3 mt-1">
          {renderMessage(props?.statusMessage, props?.date, messageColor, primaryColor, icon, props?.checklist)}
        </div>
      </div>

      {/* Timeline Dialog */}
      {mostrarTimeline && (
        <Dialog
          header="Timeline do TCC"
          visible={isTimelineVisible}
          style={{ width: '50vw' }}
          onHide={() => setIsTimelineVisible(false)}
        >
          <Timeline 
            value={historicoStatus.slice().reverse()} 
            opposite={(item) => item.statusMensagem} 
            content={(item) => (
              <small className="text-color-secondary">
                {new Date(item.dataStatus).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </small>
            )}
          />
        </Dialog>
      )}
    </div>
  );
};

export default StatusAtual;
