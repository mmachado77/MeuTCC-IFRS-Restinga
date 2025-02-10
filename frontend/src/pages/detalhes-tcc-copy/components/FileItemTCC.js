import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import TccService from '../../../services/TccService';
import { Menubar } from 'primereact/menubar';
import styles from '../assets/MyMenuBar.module.css'; // arquivo de estilos customizados

const FileItemTCC = ({ file, tccId, prazoEntrega, user, updateTccDetails, isEditable }) => {
  const toast = useRef(null);
  const fileInputRef = useRef(null);
  const [inputId, setInputId] = useState('');
  const [activeTab, setActiveTab] = useState('TCC');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Se o nome tiver mais de 15 caracteres, exibe os 15 primeiros + "..."
  const truncateFileName = (name) => {
    if (!name) return '';
    return name.length > 15 ? name.substring(0, 15) + '...pdf' : name;
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
      if (!blob) {
        throw new Error("Nenhum arquivo retornado para download.");
      }
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
    if (file) {
      if (typeof file === 'object') {
        return (
          <div>
            {renderFile()}
          </div>
        );
      }
    } else {
      return (
        <div>
          {renderNoFile()}
        </div>
      );
    }

  };

  const renderBotoes = () => {
    if (file) { //Tem arquivo
      if (isEditable) { //Tem Grants para editar
        return (
          <div className='flex justify-between gap-2'>
            <div className='w-4/6'>
              <Button
                icon="pi pi-download"
                label='Baixar'
                severity='success'
                aria-label="Baixar"
                onClick={handleFileDownload}
                loading={downloadLoading}
                className='w-full'
              />
            </div>
            <div className='w-2/5'>
              <Button
                icon="pi pi-trash"
                label='Excluir'
                severity="danger"
                aria-label="Excluir"
                onClick={handleFileDelete}
                loading={deleteLoading}
                className='w-full'
              />
            </div>
          </div>
        )
      } else {
        return (
          <div className='flex justify-between'>
            <Button
              icon="pi pi-download"
              label='Baixar'
              severity="success"
              aria-label="Baixar"
              onClick={handleFileDownload}
              loading={downloadLoading}
              className='w-full'
            />
          </div>
        )
      }
    } else if (isEditable) {
      return (
        <>
          <input
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            id={inputId}
            ref={fileInputRef}
          />
          <div className='flex justify-between'>
            <Button
              icon="pi pi-upload"
              label='Enviar Arquivo'
              severity="success"
              aria-label="Anexar"
              onClick={() => document.getElementById(inputId).click()}
              loading={uploadLoading}
              className='w-full'
            />
          </div>
        </>
      )
    } else {
      return
    }
  };
  const renderFile = () => {
    return (
      <div>
        <div className="py-6 flex items-center justify-between">
          <div className="w-full">
            <div className='p-1 border border-dashed border-[#22c55e] flex justify-between rounded-xl'>
              {/* Container do ícone (w-2/5 da largura) */}
              <div className='w-2/5 flex justify-end items-center'>
                <div
                  className="group relative cursor-pointer flex justify-center flex-wrap aspect-square w-[80%] h-[80%] bg-gray-50 shadow-md rounded-md transition-colors duration-150 hover:bg-botao-gradient"
                  onClick={downloadLoading ? undefined : handleFileDownload}
                >
                  {!downloadLoading && (
                    <>
                      {/* Ícone de PDF (visível por padrão) */}
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                        <i className="pi pi-file-pdf text-7xl text-[#22c55e]"></i>
                      </div>
                      {/* Ícone de Download (aparece no hover) */}
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <i className="pi pi-download text-6xl text-white"></i>
                      </div>
                    </>
                  )}
                  {downloadLoading && (
                    <div className="inset-0 flex items-center justify-center">
                      <i className="pi pi-spin pi-spinner text-4xl" style={{ color: "#22c55e" }}></i>
                    </div>
                  )}
                </div>
              </div>

              {/* Container das informações do arquivo (ocupa os 3/5 restantes) */}
              <div className="ml-4 py-3 w-3/5 h-[150px] text-gray-600 flex flex-col justify-between py-1">
                <div>
                  <strong>Arquivo:</strong>
                  <span className="block">{truncateFileName(file.name)}</span>
                </div>
                <div>
                  <strong>Tamanho:</strong>
                  <span className="block">{formatFileSize(file.size)}</span>
                </div>
                <div>
                  <strong>Modificado:</strong>{" "}
                  <span className="block">{file.dataModificacao ? formatDate(file.dataModificacao) : "---"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };
  const renderNoFile = () => {
    return (
      <>
        <input
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id={inputId}
          ref={fileInputRef}
        />
        <div className="w-[330px] py-6 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div
              className={`relative w-[150px] h-[150px] rounded-full bg-gray-100 ${isEditable ? "group cursor-pointer hover: transition-colors duration-150 hover:bg-botao-gradient" : ""
                }`}
              onClick={isEditable && !uploadLoading ? () => document.getElementById(inputId).click() : undefined}
            >
              {/* Ícone padrão (Excel) */}
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                <i className="pi pi-file-excel text-7xl text-gray-400"></i>
              </div>
              {/* Ícone exibido somente no hover (Upload) */}
              {isEditable && (
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <i className="pi pi-upload text-7xl text-white"></i>
                </div>
              )}
              {/* Spinner de loading, se estiver carregando */}
              {uploadLoading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-green-300">
                  <i className="pi pi-spin pi-spinner text-7xl text-white"></i>
                </div>
              )}
            </div>
            <span className="mt-4 text-base text-gray-600">Nenhum documento Adicionado.</span>
          </div>
        </div>
      </>
    );
  }
  const renderDocumentoTCC = () => {
    return (
      <div>
        <div className='px-6'>{renderFileDetails()}</div>
        <hr className="border-dashed border-gray-300 w-full mb-4" />
        <div className='px-6'>{renderBotoes()}</div>
      </div>
    )
  }

  const renderDocumentoAutorizacao = () => {
    return (
      <div>
        <h1>Este é um placeholder da autorização</h1>
      </div>
    )
  }


  const items = [
    {
      label: 'Documento do TCC',
      icon: 'pi pi-book',
      className: activeTab === 'TCC' ? styles.activeItem : '',
      command: () => setActiveTab('TCC')
    },
    {
      label: 'Autorização de Publicação',
      icon: 'pi pi-check',
      className: activeTab === 'Autorizacao' ? styles.activeItem : '',
      command: () => setActiveTab('Autorizacao')
    }
  ];



  return (
    <div className="border border-solid border-gray-300 rounded-md bg-white pb-6">
      {/* Conteúdo renderizado abaixo do menu */}
      <div>
        {renderDocumentoTCC()}
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default FileItemTCC;