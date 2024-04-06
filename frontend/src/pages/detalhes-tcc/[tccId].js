import React, { useRef, useState, useEffect } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import TccService from 'meutcc/services/TccService';
import { Tag } from 'primereact/tag';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';

const FileItem = ({ file }) => {
  const toast = useRef(null);

  const formatFileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const items = [
    { label: 'Item 1', icon: 'pi pi-upload', command: () => showToast('Upload realizado') },
    { label: 'Item 2', icon: 'pi pi-download', command: () => showToast('Download realizado') },
    { label: 'Item 3', icon: 'pi pi-trash', command: () => showToast('Documento excluido') }
  ];

  const showToast = (message) => {
    toast.current.show({ severity: 'success', summary: 'Successo', detail: message });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px', borderRadius: '10px', border: '1px solid #ccc', padding: '10px', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
          {file?.url ? (
            <div className="file-icon" style={{ margin: 0, marginRight: '1%'}}><i className="pi pi-file-pdf" style={{ fontSize: '250%' }} ></i></div>
          ) : (
            <span>Nenhum documento anexado</span>
          )}
        <div className="file-details">
          {file?.url && (
            <p>{file.name} <br /> {formatFileSize(file.size)}</p>
          )}
        </div>
      </div>
      <div style={{ height: '65px'}}>
        <Toast ref={toast}/>
        {file && (
          <SpeedDial model={items} direction="down" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined" style={{ position: 'relative'}}/>
        )}
      </div>
    </div>
  );
};

const SessoesComponent = ({ prazoPrevia, prazoFinal, estudante, orientador, sessoes }) => {
  return (
    <Accordion multiple activeIndex={[0]}>
      {sessoes.map((sessao, index) => (
        <AccordionTab key={index} header={sessao.tipo}>
          <p><b>Data {sessao.tipo}:</b> {format(sessao.data_inicio || new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
          <p><b>Local:</b> {sessao.local}</p>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <p style={{ margin: 0, marginRight: '40px' }}><b>Participantes:</b></p>
              <table>
                  <tbody>
                      <tr>
                          <td><b>Autor:</b></td>
                          <td>{estudante.nome}</td>
                      </tr>
                      <tr>
                          <td><b>Orientador:</b></td>
                          <td>{orientador.nome}</td>
                      </tr>
                      {sessao.banca.professores.map((professor, index) => (
                        <tr key={index}>
                          <td><b>Avaliador {index + 1}:</b></td>
                          <td>{professor.nome}</td>
                        </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <p><b>Parecer Orientador: </b>{sessao.parecer_orientador}</p>
          <p><b>Parecer Coordenador: </b> {sessao.parecer_coordenador}</p>
          {sessao.tipo == "Sessão Prévia"? (
              <p><b>Prazo Versão Prévia:</b> {format(prazoPrevia || new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
          ) : (
            <p><b>Prazo Versão Final:</b> {format(prazoFinal || new Date(), 'dd/MM/yyyy HH:mm:ss')}</p>
          )}
        </AccordionTab>
      ))}
      {sessoes.length == 0 && (
            <AccordionTab key="sessao-previa" header={"Sessão Prévia"}>
              <Button style={{ width: '100%',backgroundColor: '#2F9E41' }} label="Sugerir Banca" onClick={() => console.log("Adicionar sessão prévia")} />
            </AccordionTab>
        )}
          {!sessoes.some(sessao => sessao.tipo == 'Sessão Final') && (
            <AccordionTab key="sessao-final" header={"Sessão Final"}>
              <Button style={{ width: '100%',backgroundColor: '#2F9E41' }} label="Sugerir Banca" onClick={() => console.log("Adicionar sessão final")} />
            </AccordionTab>
          )}
    </Accordion>
  );
};

const getClassForStatus = (status) => {
  switch (status) {
    case 'PROPOSTA_ANALISE_PROFESSOR':
    case 'PROPOSTA_ANALISE_COORDENADOR':
    case 'DESENVOLVIMENTO':
    case 'PREVIA':
    case 'FINAL':
    case 'AJUSTE':
      return '#FFBF00';
    case 'PROPOSTA_RECUSADA_PROFESSOR':
    case 'PROPOSTA_RECUSADA_COORDENADOR':
    case 'REPROVADO_PREVIA':
    case 'REPROVADO_FINAL':
      return '#D2222D';
    case 'APROVADO':
      return '#007000';
    default:
  }
};

const DetalhesTCC = () => {
  const router = useRouter()
  const tccId = router.query.tccId
  const [TCCData, setTCCData] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const carregarDetalhesTCC = async () => {
      try {
        const data = await TccService.getDetalhesTCC(tccId);
        setTCCData(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      }
    };

    carregarDetalhesTCC();
  }, []);

  if (TCCData?.id == null) {
    return (
      <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
          <h1 className='heading-1 px-6 text-gray-700'>Detalhes do TCC</h1>
        </div>
        <div className='py-6 px-2' style={{ padding: '35px', display: 'flex', justifyContent: 'center'}}>
          <p>TCC não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
      <div className='py-3 border-0 border-b border-dashed border-gray-200'>
        <h1 className='heading-1 px-6 text-gray-700'>Detalhes do TCC</h1>
      </div>
      <div className='py-6 px-2' style={{ padding: '35px'}}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <p><b>Estudante: </b>{TCCData.autor?.nome}</p>
          <p><b>Fase: </b><Tag value={TCCData?.status?.[TCCData.status.length - 1]?.statusMensagem} style={{ backgroundColor: getClassForStatus(TCCData?.status?.[TCCData.status.length - 1]?.status)}} onClick={() => setVisible(true)}></Tag></p>
        </div>
        <p style={{ marginBottom: '35px' }}><b>Orientador:</b> {TCCData.orientador?.nome}</p>
        {TCCData.coorientador && ( <p style={{ marginBottom: '35px' }}><b>Coorientador:</b> {TCCData.coorientador?.nome}</p> )}
        <p style={{ marginBottom: '35px' }}><b>Tema:</b> {TCCData.tema}</p>
        <p style={{ marginBottom: '35px' }}><b>Data de Submissão:</b> {format(TCCData.dataSubmissaoProposta || new Date(), 'dd/MM/yyyy')}</p>
        <p style={{ marginBottom: '35px' }}><b>Resumo:</b> {TCCData.resumo}</p>
        <FileItem file={TCCData.documentoTCC} />
        <div>
          {TCCData.sessoes && (
            <SessoesComponent prazoPrevia ={TCCData.prazoEntregaPrevia} prazoFinal = {TCCData.prazoEntregaFinal} estudante={TCCData.autor} orientador={TCCData.orientador} sessoes={TCCData.sessoes} />
          )}
        </div>
      </div>
      <Dialog header="Timeline Do TCC" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
        <Timeline value={TCCData.status} opposite={(item) => item.statusMensagem} content={(item) => <small className="text-color-secondary">{format(item.dataStatus || new Date(), 'dd/MM/yyyy HH:mm:ss')}</small>} />
      </Dialog>
    </div>
  );
};

DetalhesTCC.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR]
export default DetalhesTCC;
