import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import toast from 'react-hot-toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import FormularioJustificativa from './formularioJustificativa'
import TccService from 'meutcc/services/TccService';
import { STATUS_TCC } from 'meutcc/core/constants';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';

export default function ListaTccsPendentes({userLogado}) {
    let emptyTcc = {
        id: null,
        tema: '',
        autor: { nome: '' },
        curso: { sigla: '' },
        resumo: '',
        dataSubmissaoProposta: '',
    };
    let user = userLogado;
    const router = useRouter();
    const handleNavigation = () => {
        router.push('/meus-tccs');
      };
    
    const [agreement, setAgreement] = useState(false);
    const [tccs, setTccs] = useState(null);
    const [oritacoesSimultaneas, setOritacoesSimultaneas] = useState(null);
    const [TccDialog, setTccDialog] = useState(false);
    const [tcc, setTcc] = useState(emptyTcc);
    const [selectedTcc, setSelectedTcc] = useState(null);
    const toastJanela = useRef(null);

    const [exibeFormulario, setExibeFormulario] = useState(false);

    const fetchTccsPendentes = async () => {
        try {
            const tccsPendentes = await TccService.getListarTccsPendente();
            setTccs(tccsPendentes);
            handleApiResponse(tccsPendentes);
        } catch (error) {
            handleApiResponse(error.tccsPendentes);
            console.error('Erro ao obter convites pendentes:', error);
            // Exiba uma mensagem de erro se necessário
        }
    }

    const fetchOrientacoesSimultaneas = async () => {
        try {
            const orientacoes = await TccService.getOrientacoesSimultaneas();
            setOritacoesSimultaneas(orientacoes);
            handleApiResponse(orientacoes);
        } catch (error) {
            handleApiResponse(error.orientacoes);
            console.error('Erro ao obter orientações simultâneas:', error);
            // Exiba uma mensagem de erro se necessário
        }
    }

    const atualizaConvitesPosAvaliacao = async () => {
        fetchTccsPendentes()
        if (user.resourcetype !== 'Coordenador') {
            fetchOrientacoesSimultaneas();
        }
        hideDialog()
    }

    const aceitarConvite = async () => {
        const data = await toast.promise(TccService.responderProposta(tcc.id, { aprovar: true }), {
            loading: 'Aprovando proposta...',
            success: 'Proposta aceita com sucesso!',
            error: 'Erro ao provar proposta.',
        });
        atualizaConvitesPosAvaliacao()
    };


    useEffect(() => {
        fetchTccsPendentes();
        if (user.resourcetype !== 'Coordenador') {
            fetchOrientacoesSimultaneas();
        }
    }, []); // Adicionando [] como dependência para garantir que o useEffect seja executado apenas uma vez

    const hideDialog = () => {
        setTccDialog(false);
    };

    const detalhesConvite = (tcc) => {
        setTcc({ ...tcc });
        setTccDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button label="Analisar" icon='pi pi-book' severity="success" outlined onClick={() => detalhesConvite(rowData)} />
        );
    };

    const dataSubmissaoBodyTemplate = (rowDate) => {
        return format(rowDate.dataSubmissaoProposta, 'dd/MM/yyyy')
    }

    const coorientadorTemplate = (data) => {
        return data.coorientador && data.coorientador.nome || 'Sem coorientador';
    }

    const orientadorBadgeTemplate = (rowData) => {
        // Calcula a cor do badge com base na quantidade
        let badgeColor = "bg-green-600";
        if (rowData.orientacoesDoOrientador >= rowData.limiteDoCurso) {
            badgeColor = rowData.orientacoesDoOrientador === rowData.limiteDoCurso ? "bg-orange-500" : "bg-red-600";
        }
        const tooltipText = `Este professor está orientando ${rowData.orientacoesDoOrientador} TCCs e o limite do curso é ${rowData.limiteDoCurso}.`;
    
        return (
            <div className="flex items-center space-x-2">
                <span>{rowData.orientador.nome}</span>
                {/* Envolva o badge em um div com os atributos do tooltip */}
                <div className="tooltipOrientadorBadge" data-pr-tooltip={tooltipText} data-pr-position="top">
                    <span className={`inline-flex items-center justify-center px-2 py-1 ${badgeColor} text-white text-sm font-bold rounded`}>
                        {rowData.orientacoesDoOrientador}/{rowData.limiteDoCurso}
                    </span>
                </div>
            </div>
        );
    };
    

    // Componente auxiliar para exibir o status de orientações
    function OrientationStatus({ orientacoes }) {
        if (
          !orientacoes ||
          !orientacoes.professor ||
          !orientacoes.cursos ||
          orientacoes.cursos.length === 0
        ) {
          return null;
        }
      
        // Quantidade atual de orientações ativas
        const current = orientacoes.professor.qtdOrientacoesAtivas;
      
        // Seleciona o curso com o menor limite de orientações
        const minCourse = orientacoes.cursos.reduce((prev, curr) =>
          prev.limite_orientacoes <= curr.limite_orientacoes ? prev : curr
        );
        const limit = minCourse.limite_orientacoes;
      
        // Define a "severity" para a Tag do PrimeReact:
        // - Abaixo do limite: success (verde)
        // - Igual ao limite: warning (laranja)
        // - Acima do limite: danger (vermelho)
        let severity = 'success';
        if (current === limit) {
          severity = 'warning';
        } else if (current > limit) {
          severity = 'danger';
        }
      
        // Define o texto do tooltip com as informações desejadas
        const tooltipText = `A Normativa Interna do Trabalho de Conclusão de Curso do Curso ${minCourse.nome} diz que cada professor orientador poderá conduzir o acompanhamento de até ${limit} TCCs distintos.`;
      
        return (
          <>
            {/* Inicializa o Tooltip direcionado aos elementos com a classe 'tooltipTag' */}
            <Tooltip target=".tooltipTag" style={{ fontSize: '1rem', maxWidth: '350px' }}/>
      
            <div className="flex flex-col items-end">
              {/* Envolvemos o Tag em uma div com os atributos de tooltip */}
              <div 
                className="tooltipTag" 
                data-pr-tooltip={tooltipText} 
                data-pr-position="left"
              >
                <Tag 
                  value={`Minhas Orientações: ${current}/${limit}`} 
                  severity={severity} 
                  className="text-2xl"
                />
              </div>
              <Button
                className='w-4/6 mt-2 '
                outlined
                severity='secondary' 
                label="Meus TCCs" 
                icon="pi pi-fw pi-book" 
                onClick={handleNavigation} 
                />
            </div>
          </>
        );
    }
    let isAtOrAboveLimitDialog = false;
    let limit = 0;
    if (oritacoesSimultaneas &&
        oritacoesSimultaneas.professor &&
        oritacoesSimultaneas.cursos &&
        oritacoesSimultaneas.cursos.length > 0) {
      const current = oritacoesSimultaneas.professor.qtdOrientacoesAtivas;
      const minCourse = oritacoesSimultaneas.cursos.reduce((prev, curr) =>
        prev.limite_orientacoes <= curr.limite_orientacoes ? prev : curr
      );
      limit = minCourse.limite_orientacoes;
      isAtOrAboveLimitDialog = current >= limit;
    }

    return (
        
        <div>
            <Tooltip target=".tooltipOrientadorBadge" style={{ fontSize: '0.8rem', maxWidth: '300px' }} />
            <div className='py-3'>
                {/* Render condicional do título */}
                {user.resourcetype === 'Coordenador' ? (
                    <h1 className="heading-1 text-center text-gray-700">
                    Propostas Pendentes
                    </h1>
                ) : (
                    <div className="flex justify-between mx-10 items-center">
                    {/* Cabeçalho alinhado à esquerda */}
                    <h1 className="heading-1 text-left text-gray-700">
                        Propostas Pendentes de Orientação
                    </h1>
                    {/* Componente que mostra a quantidade de orientações e o limite */}
                    <OrientationStatus orientacoes={oritacoesSimultaneas} />
                    </div>
                )}
                <div className='m-10'>
                <Toast ref={toastJanela} />
                <div className="card">
                    <DataTable value={tccs} selection={selectedTcc} onSelectionChange={(e) => setSelectedTcc(e.value)} dataKey="id" paginator rows={5} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tccs">
                        <Column field="tema" header="Tema" sortable style={{ width: '30%' }}></Column>
                        <Column field="autor.nome" header="Autor" sortable style={{ width: '10%' }}></Column>
                        <Column field="curso.sigla" header="Curso" style={{ width: '10%' }}></Column>
                        {user.resourcetype === 'Coordenador' ? (
                            <Column body={orientadorBadgeTemplate} header="Orientador" style={{ width: '15%' }} />
                        ) : (
                            <Column field="orientador.nome" header="Orientador" style={{ width: '10%' }} />
                        )}
                        <Column body={coorientadorTemplate} header="Coorientador" style={{ width: '10%' }}></Column>
                        <Column body={dataSubmissaoBodyTemplate} field="dataSubmissaoProposta" header="Data de Submissão" style={{ width: '10%' }}></Column>
                        <Column body={actionBodyTemplate} align='center' header="Ações" exportable={false} style={{ width: '20%' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={TccDialog} style={{ width: '32rem' }} header="Analisar" modal className="p-fluid" onHide={hideDialog}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="tema" className="font-bold">Tema: </label>
                        <span>{tcc.tema}</span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="autor.nome" className="font-bold">Autor: </label>
                        <span>{tcc.autor.nome}</span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="curso.sigla" className="font-bold">Curso: </label>
                        <span>{tcc.curso.sigla}</span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="resumo" className="font-bold">Resumo: </label>
                        <span>{tcc.resumo}</span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="dataSubmissao" className="font-bold">Data de Submissão da Proposta: </label>
                        <span>{tcc.dataSubmissaoProposta && format(tcc.dataSubmissaoProposta, 'dd/MM/yyyy')}</span>
                    </div>
                    {isAtOrAboveLimitDialog && (
                        <>
                            <div className="bg-yellow-100 text-yellow-700 p-3 mb-2 border border-yellow-400 rounded">
                                <strong>ATENÇÃO:</strong><br />
                                Aceitar esse Convite de Orientação te colocará acima do limite de acompanhamentos de TCCs definido pelo curso.
                                <div className="mt-3">
                                <input
                                    type="checkbox"
                                    id="agreement"
                                    checked={agreement}
                                    onChange={(e) => setAgreement(e.target.checked)}
                                />
                                <label htmlFor="agreement" className="ml-2">Estou de acordo.</label>
                            </div>
                            </div>
                            
                        </>
                    )}
                    {user.resourcetype === 'Coordenador' && 
                        tcc.orientacoesDoOrientador !== undefined &&
                        tcc.limiteDoCurso !== undefined &&
                        tcc.orientacoesDoOrientador >= tcc.limiteDoCurso && (
                            <div className="bg-yellow-100 text-yellow-700 p-3 mb-4 border border-yellow-400 rounded">
                                <strong>ATENÇÃO:</strong><br />
                                Aprovar essa proposta fará com que o Professor ultrapasse o limite de acompanhamentos de TCCs definido pelo curso.
                            </div>
                    )}
                    <div className='pt-4 border-0 border-t border-gray-200 border-dashed'>
                        <div className={'flex justify-around ' + (exibeFormulario ? 'hidden' : '')}>
                            <div>
                            <Button
                                label="Aceitar"
                                severity="success"
                                icon="pi pi-thumbs-up-fill"
                                iconPos="right"
                                onClick={aceitarConvite}
                                disabled={isAtOrAboveLimitDialog && !agreement}
                            />
                            </div>
                            <div>
                                <Button label="Recusar" severity="danger" icon='pi pi-thumbs-down-fill' iconPos='right' onClick={() => setExibeFormulario(!exibeFormulario)} />
                            </div>
                        </div>
                        <div className={(!exibeFormulario ? 'hidden' : '')} >
                            <FormularioJustificativa onSetVisibility={setExibeFormulario} onPosAvaliacao={atualizaConvitesPosAvaliacao} tcc={tcc} />
                        </div>
                    </div>
                </Dialog>
                </div>
            </div>

            
        </div>
    );
}
