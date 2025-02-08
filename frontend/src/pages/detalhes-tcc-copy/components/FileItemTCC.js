import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import TccService from '../../../services/TccService';

const FileItemTCC = ({ file, tccId, prazoEntrega, user, updateTccDetails }) => {
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const [inputId, setInputId] = useState('');
  
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Se o nome tiver mais de 10 caracteres, exibe os 10 primeiros + "..."
  const truncateFileName = (name) => {
    if (!name) return '';
    return name.length > 10 ? name.substring(0, 10) + '...' : name;
  };

  // Formata a data de modificação para "dd/mm/aa, às hh:mm"
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, às ${hours}:${minutes}`;
  };

  const formatFileSize = (size) => {
    if (!size) return '';
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const prazoExpirado = prazoEntrega && new Date(prazoEntrega) < new Date();

  const erroPrazoExpirado = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Erro',
      detail: 'O prazo para entrega do documento está expirado!'
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setUploadLoading(true);
      try {
        await TccService.uploadDocumentoTCC(tccId, formData);
        toast.current.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Documento enviado com sucesso!'
        });
        if (updateTccDetails) updateTccDetails();
      } catch (error) {
        console.error('Erro no upload:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao enviar documento.'
        });
      } finally {
        setUploadLoading(false);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleFileDelete = async () => {
    setDeleteLoading(true);
    try {
      await TccService.excluirDocumentoTCC(tccId);
      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Documento excluído com sucesso!'
      });
      if (updateTccDetails) updateTccDetails();
    } catch (error) {
      console.error('Erro no delete:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao excluir documento.'
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFileDownload = async () => {
    setDownloadLoading(true);
    try {
      const blob = await TccService.downloadDocumentoTCC(tccId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = (file && typeof file === 'object' && file.name) ? file.name : 'documento.pdf';
      link.href = url;
      link.setAttribute('download', fileName);
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

  useEffect(() => {
    if (tccId) {
      setInputId(`fileUpload-tcc-${tccId}`);
    }
  }, [tccId]);

  // Renderiza os detalhes do arquivo com o ícone acima dos textos e com texto reduzido
  const renderFileDetails = () => {
    const textStyle = { fontSize: '0.75rem' };
    if (file) {
      if (typeof file === 'object') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', ...textStyle }}>
            <i className="pi pi-file-pdf" style={{ fontSize: '5rem' }}></i>
            <div style={{ marginTop: '4px', textAlign: 'start' }}>
              <div><strong>Nome:</strong> {truncateFileName(file.name)}</div>
              <div><strong>Tamanho:</strong> {formatFileSize(file.size)}</div>
              <div><strong>Modificado:</strong> {file.dataModificacao ? formatDate(file.dataModificacao) : '---'}</div>
            </div>
          </div>
        );
      }
      if (typeof file === 'string' && file.trim() !== '') {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', ...textStyle }}>
            <i className="pi pi-file-pdf" style={{ fontSize: '1.5rem' }}></i>
            <div style={{ marginTop: '4px', textAlign: 'center' }}>
              <div><strong>Nome:</strong> Documento enviado</div>
            </div>
          </div>
        );
      }
    }
    return <span style={textStyle}>Nenhum documento anexado</span>;
  };

  // Estilo reduzido para os botões
  const buttonStyle = { fontSize: '0.75rem', padding: '0.25rem 0.5rem' };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '10px',
      border: '1px solid #ccc',
      padding: '10px',
      boxSizing: 'border-box'
    }}>
      <div style={{ flex: 1 }}>
        {renderFileDetails()}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
        {file && (typeof file === 'string' && file.trim() !== '' || (typeof file === 'object' && (file.name || file.dataModificacao))) ? (
          <>
            <Button 
              icon="pi pi-download" 
              rounded 
              severity="success" 
              aria-label="Baixar"
              onClick={handleFileDownload}
              loading={downloadLoading}
              style={buttonStyle}
            />
            {!prazoExpirado ? (
              <Button 
                icon="pi pi-trash" 
                rounded 
                severity="danger" 
                aria-label="Excluir"
                onClick={handleFileDelete}
                loading={deleteLoading}
                style={buttonStyle}
              />
            ) : (
              <Button 
                icon="pi pi-upload" 
                rounded 
                severity="secondary" 
                aria-label="Anexar"
                onClick={erroPrazoExpirado}
                style={buttonStyle}
              />
            )}
          </>
        ) : (
          <>
            {!prazoExpirado && (
              <>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  style={{ display: 'none' }}
                  onChange={handleFileChange} 
                  id={inputId} 
                  ref={fileInputRef} 
                />
                <Button 
                  icon="pi pi-upload" 
                  rounded 
                  severity="success" 
                  aria-label="Anexar"
                  onClick={() => document.getElementById(inputId).click()}
                  loading={uploadLoading}
                  style={buttonStyle}
                />
              </>
            )}
            {prazoExpirado && (
              <Button 
                icon="pi pi-upload" 
                rounded 
                severity="secondary" 
                aria-label="Anexar"
                onClick={erroPrazoExpirado}
                style={buttonStyle}
              />
            )}
          </>
        )}
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default FileItemTCC;
