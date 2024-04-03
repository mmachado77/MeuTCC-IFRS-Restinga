import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import toast from 'react-hot-toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import FormularioJustificativa from './formularioJustificativa'
import TccService from 'meutcc/services/TccService';

export default function listaTccsPendentes() {
    let emptyTcc = {
        id: null,
        tema: '',
        autor: '',
        resumo: '',
        dataSubmissaoProposta: '',
    };

    const [convits, setConvits] = useState(null);
    const [ConviteDialog, setConviteDialog] = useState(false);
    const [convite, setConvite] = useState(emptyTcc);
    const [selectedConvite, setSelectedConvite] = useState(null);
    const toastJanela = useRef(null);

    const [exibeFormulario, setExibeFormulario] = useState(false);

    const fetchConvits = async () => {
        try {
            const convitesPendentes = await TccService.getConvitesPendentes();
            
            setConvits(convitesPendentes);
        } catch (error) {
            console.error('Erro ao obter convites pendentes:', error);
            // Exiba uma mensagem de erro se necessário
        }
    }

    const atualizaConvitesPosAvaliacao = async () => {
        fetchConvits()
        hideDialog()
    }

    const aceitarConvite = async () => {
        const data = await toast.promise(TccService.aceitarConvite(convite.id), {
            loading: 'Aprovando convite de proposta tcc...',
            success: 'convite de proposta tcc aprovado com sucesso!',
            error: 'Erro ao aprovar convite de proposta tcc.',
        });
        atualizaConvitesPosAvaliacao()
    };
    

    useEffect(() => {       
        fetchConvits();
    }, []); // Adicionando [] como dependência para garantir que o useEffect seja executado apenas uma vez

    const hideDialog = () => {
        setConviteDialog(false);
    };

    const detalhesConvite = (convite) => {
        setConvite({ ...convite });
        setConviteDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
                <Button label="Detalhes" icon='pi pi-search-plus' severity="secondary" onClick={() => detalhesConvite(rowData)} />
        );
    };

    const dataSubmissaoBodyTemplate = (rowDate) => {
        return format(rowDate.dataSubmissaoProposta, 'dd/MM/yyyy')
    }

    return (
        <div>
            <Toast ref={toastJanela} />
            <div className="card">
                <DataTable value={convits} selection={selectedConvite} onSelectionChange={(e) => setSelectedConvite(e.value)} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} convits">
                    <Column field="tema" header="Tema" sortable></Column>
                    <Column field="autor.nome" header="Autor" sortable></Column>
                    <Column body={dataSubmissaoBodyTemplate} field="dataSubmissaoProposta" header="Data de Submissão" sortable style={{ width: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={ConviteDialog} style={{ width: '32rem' }} header="Detalhes do TCC" modal className="p-fluid" onHide={hideDialog}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="tema" className="font-bold">Tema: </label>
                    <span>{convite.tema}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="autor.nome" className="font-bold">Autor: </label>
                    <span>{convite.autor.nome}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="resumo" className="font-bold">Resumo: </label>
                    <span>{convite.resumo}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="dataSubmissao" className="font-bold">Data de Submissão da Proposta: </label>
                    <span>{convite.dataSubmissaoProposta && format(convite.dataSubmissaoProposta, 'dd/MM/yyyy')}</span>
                </div>
                <div className='border-0 border-t border-dashed border-gray-200 pt-4'>
                    <div className={'flex justify-around ' + (exibeFormulario ? 'hidden': '')}>
                        <div>
                            <Button label="Aceitar" severity="success" icon='pi pi-thumbs-up-fill' iconPos='right' onClick={aceitarConvite} />
                        </div>
                        <div>
                            <Button label="Recusar" severity="danger" icon='pi pi-thumbs-down-fill' iconPos='right' onClick={ () => setExibeFormulario(!exibeFormulario) } />
                        </div>
                    </div>
                    <div className={(!exibeFormulario ? 'hidden': '')} >
                        <FormularioJustificativa onSetVisibility={setExibeFormulario} onPosAvaliacao={atualizaConvitesPosAvaliacao} convite={convite}/>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
