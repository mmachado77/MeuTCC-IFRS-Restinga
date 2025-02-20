import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CardSessao from './Sessao/CardSessao';
import FileItemSessao from './FileItemSessao';
import { useTccContext } from '../context/TccContext';
import { Button } from 'primereact/button';
import AvaliaPreviaAvaliador from './Sessao/Avaliacao/AvaliaPreviaAvaliador';
import AvaliaPreviaOrientador from './Sessao/Avaliacao/AvaliaPreviaOrientador';
import BancaComentariosDialog from './Sessao/Avaliacao/BancaComentariosDialog';

const renderAvaliacao = (session) => {
  const { user, tccData } = useTccContext();
  const currentDate = new Date();
  const sessionDate = new Date(session?.data_inicio);
  let comment = '';
  
  if (user?.id === session?.banca?.professores[0]?.id) {
    comment = session?.comentarios_avaliador1;
  } else if (user?.id === session?.banca?.professores[1]?.id) {
    comment = session?.comentarios_avaliador2;
  }

  if(session?.avaliado){
    return(
      <Button
        label="Sessão Avaliada"
        pt={{ label: { style: { flex: 'none' } } }}
        icon="pi pi-star"
        className="w-full flex justify-center items-center text-xl p-button-secodary"
        disabled
        outlined
      />
    )
  }
  
  // Se o usuário for o orientador e ambos os comentários existirem, renderiza AvaliaPreviaOrientador com a prop avaliar
  if (
    user?.id === tccData?.orientador?.id &&
    session?.comentarios_avaliador1 &&
    session?.comentarios_avaliador2
  ) {
    return (
      <div>
        <AvaliaPreviaOrientador sessaoId={session?.id} avaliar />
      </div>
    );
  } else if(user?.id === tccData?.orientador?.id){
    return (
      <div>
        <AvaliaPreviaOrientador sessaoId={session?.id} />
      </div>
    );
  }

  return (
    ( 
      (user?.id === session?.banca?.professores[0]?.id ||
       user?.id === session?.banca?.professores[1]?.id) &&
      currentDate >= sessionDate
    ) && 
    <div>
      <AvaliaPreviaAvaliador sessaoId={session?.id} comment={comment} />
    </div>
  );
}

const renderFeeback = (session) =>{
  return (
    (session?.comentarios_avaliador1 || session?.comentarios_avaliador2) &&
      <div>
        <BancaComentariosDialog session={session} />
      </div>
  );
}

const SessoesDetalhes = ({ sessaoPrevia, sessaoFinal }) => {
  return (
    <div className='py-3'>
      <Accordion
        className='py-2'
        multiple
        activeIndex={sessaoPrevia ? [0] : [1]}>
        {sessaoPrevia && (
          <AccordionTab
            header={
              <span className="flex align-items-center gap-2 w-full">
                <span className="font-bold white-space-nowrap">Sessão Pública de Andamento</span>
              </span>
            }
          >
            <div className='flex gap-4'>
              <div className="w-3/5">
                <CardSessao
                  tipoSessao="PREVIA"
                  readOnly={true}
                />
              </div>
              <div className='w-2/5 h-fill flex flex-col justify-between'>
                <div className='h-fill'>
                  <FileItemSessao tipoSessao="PREVIA" />
                </div>
                <div>
                  {renderFeeback(sessaoPrevia)}
                </div>
                <div>
                  {renderAvaliacao(sessaoPrevia)}
                </div>
              </div>
            </div>
          </AccordionTab>
        )}
        {sessaoFinal && (
          <AccordionTab
            header={
              <span className="flex align-items-center gap-2 w-full">
                <span className="font-bold white-space-nowrap">Sessão Pública de Defesa</span>
              </span>
            }
          >
            <div className='flex gap-4'>
              <div className="w-3/5">
                <CardSessao
                  tipoSessao="FINAL"
                  readOnly={true}
                />
              </div>
              <div className='w-2/5 h-fill flex flex-col justify-between'>
                <div className='h-fill'>
                  <FileItemSessao tipoSessao="FINAL" />
                </div>
                <div>
                  {renderFeeback(sessaoFinal)}
                </div>
                <div>
                  {renderAvaliacao(sessaoFinal)}
                </div>
              </div>
            </div>
          </AccordionTab>
        )}
      </Accordion>
    </div>
  );
};

export default SessoesDetalhes;
