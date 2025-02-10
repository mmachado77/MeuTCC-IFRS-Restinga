import React from 'react';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';

const renderMessage = (statusMensagem) => {
  return (
    <div className="card">
      <Message
          style={{
              borderLeft: 'solid #cc8925',
              backgroundColor: '#f5e6d0',
              borderWidth: '0 0 0 6.5px',
              color: '#cc8925',
          }}
          className="border-primary w-full justify-content-start text-sm"
          severity="contrast"
          text={statusMensagem}
      />
    </div>
  )
}


const StatusAtual = ({ options }) => {
  return (
    <div className="card flex flex-col px-4 bg-gray-50 text-gray-600 rounded-md shadow-md">
      {/* Cabeçalho: Última Atualização do Projeto */}
      <div className="">
        <div className='flex justify-between text-left'>
          <Tag
          className='text-sm text-center font-semibold -mt-3 h-fit'
          value={options?.statusAtual}
          style={{ backgroundColor: '#ffbf00', color: '#FFFFFF' }}
          />
          <div className='mt-1'>
            <span className="text-sm italic">{options.date}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          {renderMessage(options.statusMessage)}
        </div>
      </div>
    </div>
  );
};

export default StatusAtual;
