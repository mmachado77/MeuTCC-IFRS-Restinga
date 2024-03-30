import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ProfessorService from 'meutcc/services/ProfessorService'; 

export default function ProfessorsDemo() {
    let emptyProfessor = {
        id: null,
        nome: '',
        cpf: '',
        email: '',
        dataCadastro: '',
        area: '',
        grau_academico: '',
        matricula: '',
        identidade: '',
        diploma: '',
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

    const detalhesProfessor = (professor) => {
        setProfessor({ ...professor });
        setProfessorDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button label="Detalhes" severity="info" onClick={() => detalhesProfessor(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={professors} selection={selectedProfessor} onSelectionChange={(e) => setSelectedProfessor(e.value)} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} professors">
                    <Column field="nome" header="Nome" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="resourcetype" header="Tipo de Registro" sortable style={{ width: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={professorDialog} style={{ width: '32rem' }} header="Detalhes do Cadastro" modal className="p-fluid" onHide={hideDialog}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="nome" className="font-bold">Nome:</label>
                    <span>{professor.nome}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="cpf" className="font-bold">CPF:</label>
                    <span>{professor.cpf}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" className="font-bold">Email:</label>
                    <span>{professor.email}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="dataCadastro" className="font-bold">Data de Cadastro:</label>
                    <span>{professor.dataCadastro}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="area" className="font-bold">Área:</label>
                    <span>{professor.area}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="grauAcademico" className="font-bold">Grau Acadêmico:</label>
                    <span>{professor.grau_academico}</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="matricula" className="font-bold">Matrícula:</label>
                    <span>{professor.matricula}</span>
                </div>
                {professor.resourcetype === 'Professor Externo' && (
                    <React.Fragment>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="identidade" className="font-bold">Identidade:</label>
                            <span>{professor.identidade || 'Não disponível'}</span>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="diploma" className="font-bold">Diploma:</label>
                            <span>{professor.diploma || 'Não disponível'}</span>
                        </div>
                    </React.Fragment>
                )}
            </Dialog>
        </div>
    );
}
