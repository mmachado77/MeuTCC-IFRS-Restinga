import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import toast from 'react-hot-toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ProfessorService from 'meutcc/services/ProfessorService';
import FormularioJustificativa from './formularioJustificativa';
import { format } from 'date-fns';

export default function ListaProfessoresInternosPendentes() {
    const [professores, setProfessores] = useState([]);
    const [professorDialog, setProfessorDialog] = useState(false);
    const [professor, setProfessor] = useState(null);
    const toastJanela = useRef(null);
    const [exibeFormulario, setExibeFormulario] = useState(false);

    const fetchProfessores = async () => {
        try {
            const response = await ProfessorService.getProfessoresInternosPendentes();
            setProfessores(response);
        } catch (error) {
            console.error('Erro ao obter professores internos pendentes:', error);
        }
    };

    const atualizaProfessoresPosAvaliacao = async () => {
        fetchProfessores();
        hideDialog();
    };

    const aprovarProfessor = async () => {
        try {
            await toast.promise(
                ProfessorService.aprovarProfessorInterno(professor.id),
                {
                    loading: 'Aprovando professor...',
                    success: 'Professor aprovado com sucesso!',
                    error: 'Erro ao aprovar professor.',
                }
            );
            atualizaProfessoresPosAvaliacao();
        } catch (error) {
            console.error('Erro ao aprovar professor:', error);
        }
    };

    useEffect(() => {
        fetchProfessores();
    }, []);

    const hideDialog = () => {
        setProfessorDialog(false);
    };

    const detalhesProfessor = (professor) => {
        setProfessor(professor);
        setProfessorDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button 
                label="Analisar" 
                icon="pi pi-search-plus" 
                severity="success" 
                outlined 
                onClick={() => detalhesProfessor(rowData)} 
            />
        );
    };

    return (
        <div>
            <Toast ref={toastJanela} />
            <div className="card">
                <DataTable value={professores} paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                emptyMessage="Não há nenhum professor pendente de Aprovação.">
                    <Column field="nome" header="Nome" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
                </DataTable>
            </div>

            <Dialog visible={professorDialog} style={{ width: '32rem' }} header="Detalhes do Cadastro" modal onHide={hideDialog}>
                {professor && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="font-bold">Nome: </label>
                            <span>{professor.nome}</span>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="font-bold">CPF: </label>
                            <span>{professor.cpf}</span>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="font-bold">Email: </label>
                            <span>{professor.email}</span>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label className="font-bold">Data de Cadastro: </label>
                            <span>{professor.dataCadastro && format(new Date(professor.dataCadastro), 'dd/MM/yyyy')}</span>
                        </div>

                        <div className="pt-4 border-0 border-t border-gray-200 border-dashed">
                            <div className={'flex justify-around ' + (exibeFormulario ? 'hidden' : '')}>
                                <Button label="Aprovar" severity="success" icon="pi pi-thumbs-up-fill" onClick={aprovarProfessor} />
                                <Button label="Recusar" severity="danger" icon="pi pi-thumbs-down-fill" onClick={() => setExibeFormulario(true)} />
                            </div>

                            {exibeFormulario && (
                                <FormularioJustificativa
                                    onSetVisibility={setExibeFormulario}
                                    atualizaProfessoresPosAvaliacao={atualizaProfessoresPosAvaliacao}
                                    professor={professor}
                                />
                            )}
                        </div>
                    </>
                )}
            </Dialog>
        </div>
    );
}
