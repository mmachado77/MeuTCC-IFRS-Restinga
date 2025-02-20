import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { ScrollPanel } from 'primereact/scrollpanel';
        

const BancaComentariosDialog = ({ session }) => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const renderPessoa = (pessoa, role) => {
    const getShortName = (fullName) => {
      if (!fullName) return "";
      const parts = fullName.split(" ");
      if (parts.length === 1) return parts[0];
      return `${parts[0]} ${parts[parts.length - 1]}`;
    };
    return (
      <div>
        <Tag
        style={{background: 'linear-gradient(43deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.4) 90%);'}}
        className="bg-transparent w-full justify-start shadow-md shadow-[#22c55e]/50">
          <div className="flex justify-between gap-2 p-2 bg-none">
            <Avatar
              className="shadow-gray-600 shadow-md size-16"
              image={pessoa?.avatar}
              shape="square"
            />
            <div className="flex flex-col justify-center ml-2 space-y-0">
              <span className="text-2xl leading-tight text-[#22c55e]">
                {getShortName(pessoa?.nome)}
              </span>
              <span className="text-lg leading-tight font-normal text-[#22c55e]">
                {role}
              </span>
            </div>
          </div>
        </Tag>
      </div>
    );
  };


  const renderfbAvaliador = (avaliador, feedback, role) => {
    return (
    <div className="border border-dashed border-[#22c55e] shadow-md flex justify-between rounded-xl">
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-center space-y-0">
          <span className="text-lg leading-tight text-[#22c55e]">
            {renderPessoa(avaliador, role)}
          </span>
        </div>
        {feedback ?(
        <ScrollPanel
        style={{ width: '95%', height: '400px' }}
        className='pl-4'
        pt={{
          barY: {className: 'shadow-md shadow-[#22c55e]/65 max-h-[45%] my-1'},
        }}
        >
          
        <p>{feedback}</p>
          
        
        </ScrollPanel>):(
        <div className='text-center content-center h-[400px] text-4xl px-6'>
        <span>{`${avaliador?.nome} ainda não submeteu sua avaliação`}</span>
        </div>)}
      </div>
    </div>)
  }

  const dialogFooter = (
    <div className="w-full flex justify-end">
      <Button
        label="Fechar"
        icon="pi pi-times"
        className="p-button-secondary"
        onClick={handleClose}
      />
    </div>
  );

  return (
    <div>
      <Button
        label="Ver Comentários da Banca"
        pt={{ label: { style: { flex: 'none' } } }}
        icon="pi pi-eye"
        className="w-full flex justify-center items-center text-lg p-button-secondary p-button-outlined"
        onClick={handleOpen}
      />
      <Dialog
        header="Feedback da Banca"
        closeOnEscape
        pt={{
          header: { style: { padding: '0.25rem' } },
          headerTitle: { className: 'text-3xl font-bold pt-4 text-center text-gray-700' },
          content: {
            style: { paddingRight: '2rem', paddingBottom: '2rem', paddingLeft: '2rem', paddingTop: '1rem', },
          },
          footer: { className: 'px-[2rem] pt-[0.6rem]' }
        }}
        visible={visible}
        //footer={dialogFooter}
        onHide={handleClose}
        className='max-w-screen-lg'
      >
        <div className='flex justify-between gap-4'>
          <div className='w-1/2'>
            {renderfbAvaliador(session?.banca?.professores[0], session?.comentarios_avaliador1 || null, "Membro da Banca")}
          </div>
          <div className='w-1/2'>
            {renderfbAvaliador(session?.banca?.professores[1], session?.comentarios_avaliador2 || null, "Membro da Banca")}
          </div>
        </div>
      </Dialog>
    </div>
  );
};


export default BancaComentariosDialog;
