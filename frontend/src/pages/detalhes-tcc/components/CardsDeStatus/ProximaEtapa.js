import React, { useEffect, useState, useRef } from 'react';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import FormSessaoDialog from '../Sessao/FormSessaoDialog';
import TccService from '../../../../services/TccService'
import { useTccContext } from '../../context/TccContext';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

const renderMessageContent = (instrucoes, primaryColor, icon) => {
  return (
    <div className="flex flex-col text-center items-center justify-between py-3">
      <div>
        <i className={`${icon}`} style={{ color: primaryColor, fontSize: '1.7rem' }}></i>
      </div>
      <div>
        <span className='text-[1.2rem]'>{instrucoes}</span>
      </div>
    </div>
  );
};

const ProximaEtapa = ({ props, fileItemRef }) => {
  const primaryColor = "#f97316";
  const messageColor = "#fff2e2b3";
  const icon = "pi pi-exclamation-circle";
  const ctaRecebido = props?.valor; // Valor inicial (pode ser null)

  // Obtenha os dados do TCC via contexto
  const { tccData, fetchData } = useTccContext();

  // Estados de controle
  const [isPreviaChecked, setIsPreviaChecked] = useState(false);
  const [instrucoesState, setInstrucoesState] = useState(props?.instrucoes);
  const [ctaState, setCtaState] = useState(ctaRecebido);
  const [openDialog, setOpenDialog] = useState(false);
  const [tipoSessaoDialog, setTipoSessaoDialog] = useState(null);
  const [editFormState, setEditFormState] = useState(false);
  const [uploadTermoLoading, setUploadTermoLoading] = useState(false);

  // Ref para input de upload do Termo de Autorização de Publicação
  const termoFileRef = useRef(null);

  useEffect(() => {
    setCtaState(props?.valor);
    setInstrucoesState(props?.instrucoes);
  }, [props?.valor, props?.instrucoes]);

  const handleTogglePrevia = (checked) => {
    setIsPreviaChecked(checked);
    if (checked) {
      setInstrucoesState("Você já pode agendar sua Sessão Pública de Andamento.");
      setCtaState("Agendar Sessão de Andamento");
    } else {
      setCtaState(ctaRecebido);
      setInstrucoesState(props?.instrucoes);
    }
  };

  const renderDialog = () => {
    return (
      <Dialog
        visible={openDialog}
        closeOnEscape
        header={ctaState}
        pt={{
          header: { style: { padding: '1.6rem' } },
          headerTitle: { className: 'text-3xl font-bold text-center text-gray-700' },
          content: { style: { paddingRight: '2rem', paddingBottom: '2rem', paddingLeft: '2rem' } }
        }}
        onHide={() => {
          setOpenDialog(false);
          setEditFormState(false);
        }}
        className='max-w-screen-lg'
      >
        <FormSessaoDialog tipoSessao={tipoSessaoDialog} onClose={setOpenDialog} />
      </Dialog>
    );
  };

  const handleCtaClick = (chave) => {
    switch (chave) {
      case "PROPOSTA":
        console.log("Handler para Sessão de Proposta");
        break;
      case "ANDAMENTO":
        setTipoSessaoDialog(chave);
        setOpenDialog(true);
        break;
      case "DOCANDAMENTO":
        if (fileItemRef && fileItemRef.current) {
          fileItemRef.current.handleUpload();
        }
        break;
      case "DEFESA":
        setTipoSessaoDialog(chave);
        setOpenDialog(true);
        break;
      case "DOCFINAL":
        if (fileItemRef && fileItemRef.current) {
          fileItemRef.current.handleUpload();
        }
        break;
      case "AJUSTE":
        console.log("Handler para Enviar Ajuste");
        break;
      case "TERMO":
        // Aciona o input oculto para upload do Termo de Autorização de Publicação
        if (termoFileRef && termoFileRef.current) {
          termoFileRef.current.click();
        }
        break;
      default:
        console.log("Ação não definida para a chave:", chave);
    }
  };

  const renderTooltip = () => {
    return (
      <div className='flex flex-col gap-1'>
        <span>O seu curso não exige a apresentação do TCC em uma Sessão Pública de Andamento.</span>
        <span>Entretanto, pode ser uma boa oportunidade para colher feedback sobre o desenvolvimento do seu trabalho.</span>
        <span>Marque essa opção para agendar sua Sessão Pública de Andamento.</span>
      </div>
    );
  };

  const renderMessage = () => {
    return (
      <div className="card">
        <div>
          <Message
            style={{
              backgroundColor: messageColor,
              color: primaryColor,
              padding: "0.5rem",
            }}
            className="w-full justify-content-start"
            severity="success"
            content={renderMessageContent(instrucoesState, primaryColor, icon)}
          />
        </div>
        {props?.previaOpcional && (
          <div className='flex flex-col gap-3 pt-4'>
            <div className="px-2 py-3 flex justify-between items-center text-[0.9rem] text-gray-600 border border-solid border-gray-300 rounded-md">
              <div className='w-2/4 p-1'>
                <label htmlFor="publicaSwitch" className="font-medium">
                  <span className='block'>Sessão Pública</span>
                  <span>de Andamento</span>
                  <i
                    className="pi pi-question-circle p-1"
                    data-pr-position="top"
                    style={{ cursor: 'pointer', fontSize: "0.9rem" }}
                  />
                </label>
                <Tooltip
                  pt={{
                    text: { style: { backgroundColor: primaryColor, color: 'text-gray-700' } }
                  }}
                  target=".pi-question-circle"
                  className='max-w-[320px] text-[0.85rem]'
                >
                  {renderTooltip()}
                </Tooltip>
              </div>
              <InputSwitch
                className='mr-2'
                id="publicaSwitch"
                checked={isPreviaChecked}
                onChange={(e) => handleTogglePrevia(e.value)}
              />
            </div>
          </div>
        )}
        {ctaState && (
          <div className='mt-3'>
            <Button
              onClick={() =>
                isPreviaChecked
                  ? handleCtaClick("ANDAMENTO")
                  : handleCtaClick(props?.cta?.chave)
              }
              pt={{ label: { style: { flex: 'none' } } }}
              className='w-full flex justify-center text-[0.70rem]'
              icon='pi pi-exclamation-circle'
              label={ctaState}
              severity='warning'
            />
          </div>
        )}
      </div>
    );
  };

  // Handler para o upload do Termo de Autorização de Publicação
  const handleTermoFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setUploadTermoLoading(true);
      try {
        await TccService.uploadAutorizacaoPublicacao(tccData?.id, formData);
        handleApiResponse({ data: { message: "Upload do Termo realizado com sucesso!" } });
        await fetchData({});
      } catch (error) {
        handleApiResponse(error.response);
        console.error("Erro no upload do Termo:", error);
      } finally {
        setUploadTermoLoading(false);
        if (termoFileRef.current) {
          termoFileRef.current.value = null;
        }
      }
    }
  };
  

  return (
    <div
      className={`card flex flex-col px-4 mt-10 border border-dashed rounded-md shadow-md`}
      style={{ borderColor: primaryColor }}
    >
      {/* Input oculto para upload do Termo */}
      <input
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        ref={termoFileRef}
        onChange={handleTermoFileChange}
      />
      <div className='text-start -mt-[0.85rem]'>
        <Tag
          className='h-fit text-[1rem] font-semibold'
          value="Próximos passos"
          style={{ backgroundColor: `${primaryColor}`, color: '#FFFFFF' }}
        />
      </div>
      <div className="flex items-center justify-between mt-2 mb-3">
        {renderMessage()}
      </div>
      <div>
        {renderDialog()}
      </div>
    </div>
  );
};

export default ProximaEtapa;
