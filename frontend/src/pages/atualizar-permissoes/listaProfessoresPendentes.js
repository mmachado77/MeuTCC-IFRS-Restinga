import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import ProfessorService from 'meutcc/services/ProfessorService'; 

export default function ProfessorsDemo() {
    let emptyProfessor = {
        id: null,
        nome: '',
        email: '',
        resourcetype: ''
    };

    const mapaTipoRegistro = {
        ProfessorInterno: 'Professor Interno',
        ProfessorExterno: 'Professor Externo'
    }

    const [professors, setProfessors] = useState(null);
    const [professorDialog, setProfessorDialog] = useState(false);
    const [professor, setProfessor] = useState(emptyProfessor);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchProfessors() {
            try {
                const professoresPendentes = await ProfessorService.getProfessoresPendentes();
                const professoresPendentes2 = professoresPendentes.map(professorPendente => {
                    return {
                        ...professorPendente, 
                        resourcetype: mapaTipoRegistro[professorPendente.resourcetype]
                    }
                })
                setProfessors(professoresPendentes2);
            } catch (error) {
                console.error('Erro ao obter professores pendentes:', error);
                // Exiba uma mensagem de erro se necessário
            }
        }

        fetchProfessors();
    }, []); // Adicionando [] como dependência para garantir que o useEffect seja executado apenas uma vez

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
                <Button label="Detalhes" severity="info" rounded onClick={() => editProfessor(rowData)} />
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
                    <Column field="resourcetype" header="Tipo de Registro" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={professorDialog} style={{ width: '32rem' }} header="Detalhes do Cadastro" modal className="p-fluid" onHide={hideDialog}>
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
                    <label htmlFor="resourcetype" className="font-bold">
                        Tipo de Registro
                    </label>
                    <InputText id="resourcetype" value={professor.resourcetype} readOnly />
                </div>
            </Dialog>
        </div>
    );
}
