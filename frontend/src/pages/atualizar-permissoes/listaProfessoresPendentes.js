import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ProfessoresPendentesService from 'meutcc/services/ProfessoresPendentesService'; 

export default function ProfessorsDemo() {
    let emptyProfessor = {
        id: null,
        nome: '',
        email: '',
        tipoRegistro: '' // Corrigido para tipoRegistro
    };

    const [professors, setProfessors] = useState(null);
    const [professorDialog, setProfessorDialog] = useState(false);
    const [professor, setProfessor] = useState(emptyProfessor);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchProfessors() {
            try {
                const professoresPendentes = await ProfessoresPendentesService.getProfessoresInternosPendentes(); // Chame o serviço para obter professores pendentes
                setProfessors(professoresPendentes);
            } catch (error) {
                console.error('Erro ao obter professores pendentes:', error);
                // Exiba uma mensagem de erro se necessário
            }
        }

        fetchProfessors();
    }, []);

    const hideDialog = () => {
        setProfessorDialog(false);
    };

    const editProfessor = (professor) => {
        setProfessor({ ...professor });
        setProfessorDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-search" rounded outlined onClick={() => editProfessor(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={professors} selection={selectedProfessor} onSelectionChange={(e) => setSelectedProfessor(e.value)} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} professors">
                    <Column field="nome" header="Nome" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="tipoRegistro" header="Tipo de Registro" sortable style={{ minWidth: '16rem' }}></Column> {/* Corrigido para tipoRegistro */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={professorDialog} style={{ width: '32rem' }} header="Professor Details" modal className="p-fluid" onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="Nome" className="font-bold">
                        Nome
                    </label>
                    <InputText id="nome" value={professor.nome} readOnly />
                </div>
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Email
                    </label>
                    <InputText id="email" value={professor.email} readOnly />
                </div>
                <div className="field">
                    <label htmlFor="tipoRegistro" className="font-bold"> {/* Corrigido para tipoRegistro */}
                        Registration Type
                    </label>
                    <InputText id="tipoRegistro" value={professor.tipoRegistro} readOnly /> {/* Corrigido para tipoRegistro */}
                </div>
            </Dialog>
        </div>
    );
}
