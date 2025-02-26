import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import AvaliaFinal from './AvaliaFinal'; // ajuste o caminho conforme sua estrutura
import AvaliacaoService from '../../../services/AvaliacaoService';
import { useTccContext } from 'meutcc/pages/detalhes-tcc-copy/context/TccContext';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';
import { Tooltip } from 'primereact/tooltip';
import { Badge } from 'primereact/badge';

const BotoesAvaliacao = ({ isOrientador, session, avaliado }) => {
    const { tccData, fetchData } = useTccContext();
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    
    const avaliacaoId = session?.avaliacao?.id;
    const autor = tccData?.autor?.nome;
    // Verifica se deve mostrar o botão de envio da ficha
    const enviarFicha = (isOrientador && (!session?.avaliacao?.ficha_avaliacao)) ? true : false;

    const handleBaixarAvaliacao = async (avaliacaoId) => {
        setLoadingDownload(true);
        try {
          let response;
          let fileName;
          // Se a ficha de avaliação estiver preenchida (ou seja, enviada pelo usuário)
          if (session?.avaliacao?.ficha_avaliacao) {
            // Chama o endpoint que baixa a ficha assinada
            response = await AvaliacaoService.downloadFichaAvaliacao(avaliacaoId);
            fileName = `[AVALIAÇÃO][ASSINADA]${autor}.pdf`
          } else {
            // Caso contrário, baixa a ficha preenchida automaticamente pelo sistema
            response = await AvaliacaoService.downloadFichaAvaliacaoPreenchida(avaliacaoId);
            fileName = `[AVALIAÇÃO]${autor}.pdf`
          }
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${fileName}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          handleApiResponse(response);
        } catch (error) {
          handleApiResponse(error.response);
        } finally {
          setLoadingDownload(false);
        }
      };
      

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            setLoading(true);
            try {
                await AvaliacaoService.uploadFichaAvaliacao(avaliacaoId, formData);
                await fetchData({})
                handleApiResponse({ data: { message: 'Upload realizado com sucesso!' } });
            } catch (error) {
                handleApiResponse(error.response);
            } finally {
                setLoading(false);
                // Limpa o input
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            }
        }
    };

    const handleAnexarFicha = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        } else {
            console.log("fileInputRef.current está indefinido");
        }
    };

    const renderTooltip = () => {
        return (
            <div className='flex flex-col gap-1'>
                <span>A ficha de avaliação desse TCC foi gerada automaticamente pelo sistema.</span>
                <span>Como Orientador, você precisa recolher as assinaturas dos membros da banca.</span>
                <span>Por fim, clique em "Anexar Ficha" e envie o documento assinado por todas as partes.</span>
            </div>
        );
    };

    const renderBadgeContent = () => {
        return (
            <>
                <span className="relative flex size-6">
                    <span className="absolute inline-flex h-full w-full animate-[ping_0.70s_infinite] rounded-full bg-[#f97316]/90 opacity-75"></span>
                    <span className="tooltipTargetAvaliacao relative inline-flex justify-center items-center size-6 rounded-full bg-white/95 border-2 border-solid border-[#f97316] cursor-pointer" data-pr-position="top">
                        <i className="not-italic font-semibold" style={{ fontSize: '1.25rem', color: '#f97316' }}>!</i>
                    </span>
                </span>
                <Tooltip
                    pt={{
                        text: { style: { backgroundColor: 'rgba(249,115,22,0.8)', backdropFilter: 'blur(10px)', color: 'text-gray-700' } }
                    }}
                    target=".tooltipTargetAvaliacao"
                    className='max-w-[320px] text-[0.85rem]'
                >
                    {renderTooltip()}
                </Tooltip>
            </>
        );
    };

    if (avaliado) {
        return (
            <div className="gap-2 pt-2 px-2 flex w-full">
                {/* Input oculto para upload */}
                <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div className={enviarFicha ? 'w-5/8' : 'w-full text-lg'}>
                    <Button
                        label="Baixar Avaliação"
                        pt={{ label: { style: { flex: 'none' } } }}
                        icon="pi pi-file-check"
                        outlined={enviarFicha}
                        loading={loadingDownload}
                        className="py-1 flex justify-center items-center text-sm w-full p-button-success"
                        onClick={() => handleBaixarAvaliacao(avaliacaoId)}
                    />
                </div>
                {enviarFicha && (
                    <div className="w-3/8 relative">
                        <Button
                            label="Anexar Ficha"
                            pt={{ label: { style: { flex: 'none' } } }}
                            loading={loading}
                            icon="pi pi-file-arrow-up"
                            className="py-1 flex justify-center items-center text-sm w-full p-button-warning"
                            onClick={handleAnexarFicha}
                        />
                        <div style={{ position: 'absolute', top: -10, right: -10 }}>
                            {renderBadgeContent()}
                        </div>
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="px-2 pt-4">
                <AvaliaFinal session={session} />
            </div>
        );
    }
};

export default BotoesAvaliacao;
