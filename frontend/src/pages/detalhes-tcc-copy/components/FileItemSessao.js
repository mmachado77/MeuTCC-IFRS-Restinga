import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import TccService from '../../../services/TccService';
import { useTccContext } from '../context/TccContext';

const FileItemSessao = ({ tipoSessao }) => {
    const toast = useRef(null);
    const [downloadLoading, setDownloadLoading] = useState(false);

    // Obter os dados do contexto
    // Supondo que o TccContext disponibilize tccData e seu array de sessões
    // Você deve importar o hook do contexto, por exemplo:
    // import { useTccContext } from '../../context/TccContext';
    // e então:
    const { tccData } = useTccContext();

    // Lógica para obter a sessão conforme o tipoSessao passado
    let session = null;
    if (tccData && tccData.sessoes && Array.isArray(tccData.sessoes)) {
        if (tipoSessao.toUpperCase() === 'PREVIA') {
            session = tccData.sessoes.find(
                (s) => s.tipo && s.tipo.toLowerCase().includes('sessão prévia')
            );
        } else if (tipoSessao.toUpperCase() === 'FINAL') {
            session = tccData.sessoes.find(
                (s) => s.tipo && s.tipo.toLowerCase().includes('sessão final')
            );
        }
    }

    // Caso não encontre a sessão, podemos renderizar uma mensagem informativa
    if (!session) {
        return (
            <div className="py-6 flex justify-center items-center border border-gray-300 rounded-md bg-gray-100">
                <p>Nenhuma sessão {tipoSessao.toLowerCase()} encontrada.</p>
            </div>
        );
    }

    // Funções auxiliares
    const truncateFileName = (name) => {
        if (!name) return '';
        return name.length > 15 ? name.substring(0, 15) + '...pdf' : name;
    };

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

    // Função para download utilizando o serviço downloadDocumentoSessao
    const handleFileDownload = async () => {
        setDownloadLoading(true);
        try {
            // Chama o serviço passando o id da sessão
            const blob = await TccService.downloadDocumentoSessao(session.id);
            if (!blob) {
                throw new Error("Nenhum arquivo retornado para download.");
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            const fileName =
                session.documentoTCCSessao && session.documentoTCCSessao.name
                    ? session.documentoTCCSessao.name
                    : 'documento.pdf';
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

    // Renderiza os detalhes do arquivo, caso exista documentoTCCSessao
    const renderFile = () => {
        let fileData = session.documentoTCCSessao;
        if (typeof fileData === 'string') {
            try {
              fileData = JSON.parse(fileData);
            } catch (error) {
              console.error("Erro ao converter documentoTCCSessao", error);
              fileData = {};
            }
          }
        return (
            <div>
                <div className="pt-4 flex items-center justify-between">
                    <div className="w-full">
                        <div className="p-1 border border-dashed border-[#22c55e] shadow-md flex justify-between rounded-xl">
                            <div className="flex flex-col w-full">
                                <div className="text-center -mt-[1.4rem] pl-4 w-fit">
                                    <Tag
                                        icon="pi pi-file-pdf text-lg ml-2"
                                        className="h-fit text-[1.15rem] font-medium gap-2"
                                        value="Documento da Sessão"
                                        style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
                                    />
                                </div>
                                <div className="flex">
                                    <div className="w-2/5 flex justify-end items-center">
                                        <div
                                            className="group relative cursor-pointer flex justify-center flex-wrap aspect-square w-[80%] h-[80%] bg-gray-50 shadow-md rounded-md transition-colors duration-150 hover:bg-botao-gradient"
                                            onClick={downloadLoading ? undefined : handleFileDownload}
                                        >
                                            {!downloadLoading && (
                                                <>
                                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
                                                        <i className="pi pi-file-pdf text-7xl text-[#22c55e]"></i>
                                                    </div>
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
                                    <div className="mx-4 py-6 w-3/5 h-fit gap-2  text-[0.85rem] text-gray-600 flex flex-col justify-between">
                                        <div>
                                            <strong>Arquivo:</strong>
                                            <span className="block">{truncateFileName(fileData.name)}</span>
                                        </div>
                                        <div>
                                            <strong>Tamanho:</strong>
                                            <span className="block">{formatFileSize(fileData.size)}</span>
                                        </div>
                                        <div>
                                            <strong>Modificado:</strong>
                                            <span className="block">
                                                {fileData.dataModificacao ? formatDate(fileData.dataModificacao) : "---"}
                                            </span>
                                        </div>
                                        {/* Botão único para download */}
                                        <div className="">
                                            <Button
                                                icon="pi pi-download"
                                                label="Baixar"
                                                severity="success"
                                                aria-label="Baixar"
                                                onClick={handleFileDownload}
                                                loading={downloadLoading}
                                                pt={{ label: { style: { flex: 'none' } } }}
                                                className='py-1 flex justify-center'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    // Renderiza um placeholder sem funcionalidades, caso não exista documento
    const renderNoFile = () => {
        return (
            <div className="py-6 flex justify-center items-center border border-gray-300 rounded-md bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="relative w-[150px] h-[150px] rounded-full bg-gray-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="pi pi-info-circle text-7xl text-gray-400"></i>
                        </div>
                    </div>
                    <span className="mt-4 text-base text-gray-600">Nenhum documento encontrado.</span>
                </div>
            </div>
        );
    };

    return (
        <div className="">
            {session.documentoTCCSessao ? renderFile() : renderNoFile()}
            <Toast ref={toast} />
        </div>
    );
};

export default FileItemSessao;
