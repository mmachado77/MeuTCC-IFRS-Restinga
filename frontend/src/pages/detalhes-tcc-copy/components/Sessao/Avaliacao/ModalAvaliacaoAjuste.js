import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import AvaliacaoService from '../../../../../services/AvaliacaoService';
import { useTccContext } from 'meutcc/pages/detalhes-tcc-copy/context/TccContext';

const ModalAvaliacaoAjuste = ({ visible, onHide }) => {
  const toast = useRef(null);
  const { tccData, fetchData } = useTccContext();
  const sessaoFinal = tccData?.sessoes?.find(s => s.resourcetype === 'SessaoFinal');
  const avaliacaoId = sessaoFinal?.avaliacao?.id;

  // Estado para definir se estamos em reprovação (exibindo campo de justificativa)
  const [isReprovando, setIsReprovando] = useState(false);
  const [justificativa, setJustificativa] = useState('');

  const handleAvaliarAjustes = async (resultadoAjuste, parecer = '') => {
    try {
      const data = {
        parecer_orientador: parecer,
        resultado_ajuste: resultadoAjuste.toString() // API espera 'true' ou 'false'
      };

      await AvaliacaoService.avaliarAjustes(avaliacaoId, data);
      toast.current.show({
        severity: 'success',
        summary: 'Avaliação',
        detail: 'Avaliação realizada com sucesso!'
      });
      fetchData();
      resetModal();
      onHide();
    } catch (error) {
      console.error('Erro ao avaliar ajustes:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao avaliar os ajustes.'
      });
    }
  };

  const resetModal = () => {
    setIsReprovando(false);
    setJustificativa('');
  };

  // Handlers para os botões
  const handleAprovar = () => {
    handleAvaliarAjustes(true);
  };

  const handleReprovarClick = () => {
    // Ao clicar em "Reprovar", exibe o campo de justificativa
    setIsReprovando(true);
  };

  const handleConfirmReprovacao = () => {
    if (!justificativa.trim()) {
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Justificativa é obrigatória para reprovar os ajustes.'
      });
      return;
    }
    handleAvaliarAjustes(false, justificativa);
  };

  const handleCancelReprovacao = () => {
    // Retorna para o estado inicial do modal
    setIsReprovando(false);
    setJustificativa('');
  };

  // Define o conteúdo e os botões do modal conforme o estado
  const renderFooter = () => {
    if (isReprovando) {
      return (
        <div className="flex justify-content-end gap-2">
          <Button 
            label="Cancelar" 
            icon="pi pi-times" 
            className="p-button-secondary" 
            onClick={handleCancelReprovacao}
          />
          <Button 
            label="Confirmar Reprovação" 
            icon="pi pi-check" 
            className="p-button-danger" 
            onClick={handleConfirmReprovacao}
          />
        </div>
      );
    } else {
      return (
        <div className="flex justify-content-end gap-2">
          <Button 
            label="Reprovar" 
            icon="pi pi-times" 
            className="p-button-danger" 
            onClick={handleReprovarClick}
          />
          <Button 
            label="Aprovar" 
            icon="pi pi-check" 
            className="p-button-success" 
            onClick={handleAprovar}
          />
        </div>
      );
    }
  };

  return (
    <>
      <Dialog 
        header="Avalie os ajustes feitos pelo aluno" 
        visible={visible} 
        onHide={() => { resetModal(); onHide(); }} 
        footer={renderFooter()}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        style={{ width: '30vw' }}
      >
        {isReprovando ? (
          <div className="flex flex-column gap-2">
            <label htmlFor="justificativa"><strong>Justificativa</strong></label>
            <InputTextarea 
              id="justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              rows={5}
              cols={30}
              autoResize
            />
          </div>
        ) : (
          <p className="m-0">
            Confirme sua avaliação dos ajustes realizados pelo aluno.
          </p>
        )}
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};

export default ModalAvaliacaoAjuste;
