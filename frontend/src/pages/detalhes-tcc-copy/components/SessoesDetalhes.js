import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CardSessao from './Sessao/CardSessao';
import FileItemSessao from './FileItemSessao';
import { useTccContext } from '../context/TccContext';
import { Button } from 'primereact/button';
import AvaliaPreviaAvaliador from './Sessao/Avaliacao/AvaliaPreviaAvaliador';
import AvaliaPreviaOrientador from './Sessao/Avaliacao/AvaliaPreviaOrientador';
import AvaliaFinal from './Sessao/Avaliacao/AvaliaFinal';
import StatusAvaliacaoMeteor from './Sessao/Avaliacao/StatusAvaliacaoMeteor';
import BancaComentariosDialog from './Sessao/Avaliacao/BancaComentariosDialog';

const renderAvaliacao = (session) => {
  const { user, tccData } = useTccContext();
  const currentDate = new Date();
  const sessionDate = new Date(session?.data_inicio);

  // Garante que nenhum conteúdo seja renderizado se a data atual for anterior à data agendada
  if (currentDate < sessionDate) return null;

  let comment = '';
  if (user?.id === session?.banca?.professores[0]?.id) {
    comment = session?.comentarios_avaliador1;
  } else if (user?.id === session?.banca?.professores[1]?.id) {
    comment = session?.comentarios_avaliador2;
  }

  if (session?.avaliado) {
    return (
      <Button
        label="Sessão Avaliada"
        pt={{ label: { style: { flex: 'none' } } }}
        icon="pi pi-star"
        className="w-full flex justify-center items-center text-xl p-button-secodary"
        disabled
        outlined
      />
    );
  }

  // Render para SessaoFinal: professores 1, 2 ou orientador
  if (session?.resourcetype === "SessaoFinal") {
    let isOrientador = false
    if(user?.id === tccData?.orientador?.id){
      isOrientador = true
    }
    let avaliado = (session?.avaliacao?.avaliado_avaliador2 &&
      session?.avaliacao?.avaliado_avaliador1 &&
      session?.avaliacao?.avaliado_orientador) ? true : false
    if (
      user?.id === session?.banca?.professores[0]?.id ||
      user?.id === session?.banca?.professores[1]?.id ||
      user?.id === tccData?.orientador?.id
    ) {
      if(avaliado){
        return (
          <div className='gap-2 pt-2 px-2 flex w-full'>
            <div className={isOrientador? 'w-5/8' : 'w-full text-lg'}>
              <Button
                label="Baixar Avaliação"
                pt={{ label: { style: { flex: 'none' } } }}
                icon="pi pi-file-check"
                outlined={isOrientador}
                className="py-1 flex justify-center items-center text-sm w-full p-button-success"
                onClick=""
              />
            </div>
            {isOrientador &&
            <div className='w-3/8'>
              <Button
                label="Anexar Ficha"
                pt={{ label: { style: { flex: 'none' } } }}
                icon="pi pi-file-arrow-up"
                className="py-1 flex justify-center items-center text-sm w-full p-button-warning"
                onClick=""
              />
            </div>
            }
          </div>
        )
      } else{
        return(
          <div className='px-2 pt-4'>
            <AvaliaFinal session={session} />
          </div>
        );
      }
      
    }
    return null;
  } else {
    // SessaoPrevia: lógica atual
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
    } else if (user?.id === tccData?.orientador?.id) {
      return (
        <div>
          <AvaliaPreviaOrientador sessaoId={session?.id} />
        </div>
      );
    }

    return (
      (user?.id === session?.banca?.professores[0]?.id ||
        user?.id === session?.banca?.professores[1]?.id) && (
        <div>
          <AvaliaPreviaAvaliador sessaoId={session?.id} comment={comment} />
        </div>
      )
    );
  }
};

const renderStatusAvaliacao = (session) => {
  const currentDate = new Date();
  const sessionDate = new Date(session?.data_inicio);
  if (currentDate < sessionDate) return null;
  return(
    <StatusAvaliacaoMeteor sessaoFinal={session}/>
  )
}


const renderFeeback = (session) => {
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
                <div className='px-2'>
                  {renderFeeback(sessaoPrevia)}
                </div>
                <div className='px-2'>
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
              <div className="w-3/5 h-fill">
                <CardSessao
                  tipoSessao="FINAL"
                  readOnly={true}
                />
              </div>
              <div className='w-2/5 flex flex-col justify-between gap-8'>
                <div className=''>
                  <FileItemSessao tipoSessao="FINAL" />
                </div>
                <div className="px-6 py-6 border border-dashed border-[#22c55e] shadow-md rounded-xl flex flex-col gap-2">
                  <div className=''>
                    {renderStatusAvaliacao(sessaoFinal)}
                  </div>
                  <div className=''>
                    {renderAvaliacao(sessaoFinal)}
                  </div>
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
