import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import AvaliacaoService from '../../../../../services/AvaliacaoService';
import { useTccContext } from 'meutcc/pages/detalhes-tcc/context/TccContext';
import ModalAvaliacaoAjuste from './ModalAvaliacaoAjuste'

const FileItemAjuste = () => {
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  // Estados de loading
  const [uploadLoading, setUploadLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  // Estado para controle do modal de avaliação
  const [modalVisible, setModalVisible] = useState(false);

  // Dados do arquivo (se já enviado)
  const [fileData, setFileData] = useState(null);

  // Contexto para saber se é autor e recarregar dados
  const { tccData, user, fetchData } = useTccContext();
  const sessao = tccData?.sessoes?.find((s) => s.resourcetype === 'SessaoFinal');
  const avaliacao = sessao?.avaliacao;
  const avaliacaoId = avaliacao?.id;
  const isAutor = user?.id && tccData?.autor?.id === user?.id;

  // Função para truncar nome de arquivo
  const truncateFileName = (name) => {
    if (!name) return '';
    return name.length > 15 ? name.substring(0, 15) + '...' : name;
  };

  // Carrega os metadados do arquivo (se existir)
  useEffect(() => {
    if (avaliacao?.tcc_definitivo) {
      const def = avaliacao.tcc_definitivo;
      if (typeof def === 'string') {
        try {
          setFileData(JSON.parse(def));
        } catch (error) {
          console.error('Erro ao interpretar os dados do arquivo:', error);
        }
      } else {
        setFileData(def);
      }
    }
  }, [avaliacao]);

  // Upload do arquivo
  const handleFileUpload = async (event) => {
    if (!avaliacaoId) return;
    const file = event.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await AvaliacaoService.uploadDocumentoAjuste(avaliacaoId, formData);
      await fetchData(); // Recarrega dados após upload

      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Upload realizado com sucesso!'
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao enviar documento.'
      });
    } finally {
      setUploadLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  // Download do arquivo
  const handleFileDownload = async () => {
    if (!avaliacaoId) return;
    setDownloadLoading(true);
    try {
      const blob = await AvaliacaoService.downloadDocumentoAjuste(avaliacaoId);
      if (!blob) throw new Error('Nenhum arquivo retornado para download.');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileData?.name || 'documento-ajuste.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro no download:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao baixar documento.'
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  // Abre o modal de avaliação
  const handleEvaluate = () => {
    setModalVisible(true);
  };

  // Renderizações dos diferentes cenários

  // 1) Autor sem arquivo
  const renderAuthorNoFile = () => (
    <div className="flex w-full h-full justify-around">
      <div className="bg-gray-100/60 self-stretch flex flex-col items-center justify-around p-2 rounded-xl">
        <i className="pi pi-times-circle text-7xl text-gray-700"></i>
        <div className="text-[0.7rem]">
          <strong>Arquivo: </strong>
          <span>Não enviado.</span>
        </div>
        <div className="mt-2">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            ref={fileInputRef}
            accept=".pdf"
          />
          <Button
            pt={{ label: { style: { flex: 'none' } } }}
            className="py-1 flex justify-center"
            label="Upload"
            severity="warning"
            icon="pi pi-upload"
            onClick={() => fileInputRef.current?.click()}
            loading={uploadLoading}
          />
        </div>
      </div>
    </div>
  );

  // 2) Autor com arquivo
  const renderAuthorWithFile = () => (
    <div className="flex w-full h-full justify-around">
      <div className="bg-gray-100/60 text-[#f97316] self-stretch flex flex-col items-center justify-around p-2 rounded-xl">
        <i className="pi pi-file-pdf text-7xl"></i>
        <div className="text-[0.7rem]">
          <strong>Arquivo: </strong>
          <span>{truncateFileName(fileData?.name)}</span>
        </div>
      </div>
    </div>
  );

  // 3) Orientador sem arquivo
  const renderOrientadorNoFile = () => (
    <div className="flex w-full h-full justify-around">
      <div className="bg-gray-100/60 self-stretch flex flex-col items-center justify-around p-2 rounded-xl">
        <i className="pi pi-times-circle text-7xl text-gray-700"></i>
        <div className="text-[0.7rem]">
          <strong>Arquivo: </strong>
          <span>Não enviado.</span>
        </div>
      </div>
    </div>
  );

  // 4) Orientador com arquivo (inclui botão de Avaliar que abre o modal)
  const renderOrientadorWithFile = () => (
    <div className="flex w-full h-full justify-around gap-4 py-4 px-2">
      {/* Contêiner da esquerda: PDF + Nome */}
      <div className="bg-gray-100/60 text-[#f97316] self-stretch flex flex-col items-center justify-around p-2 rounded-xl">
        <i className="pi pi-file-pdf text-7xl "></i>
        <div className="text-[0.7rem]">
          <strong>Arquivo: </strong>
          <span>{truncateFileName(fileData?.name)}</span>
        </div>
      </div>

      {/* Contêiner da direita: botões */}
      <div className="h-full flex flex-col items-center justify-around w-3/5 p-2 gap-4 rounded-xl">
        <Button
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-full flex justify-center h-2/4"
          label="Baixar"
          severity="success"
          outlined
          icon="pi pi-download"
          onClick={handleFileDownload}
          loading={downloadLoading}
        />
        <Button
          pt={{ label: { style: { flex: 'none' } } }}
          className="w-full flex justify-center h-2/4"
          label="Avaliar"
          severity="success"
          icon="pi pi-file-edit"
          onClick={handleEvaluate}
        />
      </div>
    </div>
  );

  // Escolher o cenário a ser renderizado
  let content;
  if (isAutor) {
    content = fileData ? renderAuthorWithFile() : renderAuthorNoFile();
  } else {
    content = fileData ? renderOrientadorWithFile() : renderOrientadorNoFile();
  }

  return (
    <div className="w-full h-full">
      {content}
      <Toast ref={toast} />
      <ModalAvaliacaoAjuste visible={modalVisible} onHide={() => setModalVisible(false)} />
    </div>
  );
};

export default FileItemAjuste;
