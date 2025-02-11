import React, { useState } from 'react';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Message } from 'primereact/message';

const renderMessage = (statusMensagem, date, corFundo, primaryColor, icon) => {
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
          content={renderMessageContent(statusMensagem, primaryColor, date, icon)}
      />
    </div>
  );
}

const renderMessageContent = (statusMensagem, primaryColor, date, icon) => {
  return (
    <div className="flex items-center justify-between gap-1">
      <div className='w-1/5 flex justify-center'>
      <i className={`${icon}`} style={{ color: primaryColor, fontSize: '1.7rem'  }}></i>
      </div>
      <div className='w-4/5'>
      <span className='text-[0.75rem]'>{statusMensagem}</span>
      <div>
      <span className="text-[0.75rem] text-end mb-3 italic">Última Atualização: {date}</span>
      </div>
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
        <div className="flex items-center justify-between mt-1 mb-3">
          {renderMessage(props?.statusMessage, props?.date, messageColor, primaryColor, icon)}
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
