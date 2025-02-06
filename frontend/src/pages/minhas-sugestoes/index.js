import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { GUARDS } from 'meutcc/core/constants';
import {AdminCursoService} from '../../services/CursoService';
import TccService from 'meutcc/services/TccService';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown'; // Import do componente Dropdown
import { useAuth } from 'meutcc/core/context/AuthContext';

const SugestoesTemasTccPage = () => {
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [tableSearchValue, setTableSearchValue] = useState('');
    const [sugestoes, setSugestoes] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [selectedTema, setSelectedTema] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editDescricao, setEditDescricao] = useState('');
    const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);
    const [themeToDelete, setThemeToDelete] = useState(null);
    const [expandedRows, setExpandedRows] = useState(null);

    // Novos estados para o Dropdown de Cursos
    const [cursos, setCursos] = useState([]);
    const [cursoSelecionado, setCursoSelecionado] = useState(null);

    const { user } = useAuth();

    const initFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS }
        });
    };

    const fetchSugestoesTcc = async () => {
        setLoading(true);
        try {
            const data = user.resourcetype === 'Coordenador'
                ? await TccService.getSugestoes()
                : await TccService.getMinhasSugestoes();
            setSugestoes(data);
            console.log(data);
        } catch (error) {
            console.error('Erro ao buscar as sugestões de temas', error);
        }
        setLoading(false);
    };

    // Buscando os cursos do usuário ao montar o componente
    useEffect(() => {
        initFilters();
        fetchSugestoesTcc();

        // Chamada do serviço para obter os cursos do usuário
        AdminCursoService.getCursosByUsuario()
            .then(data => {
                setCursos(data);
            })
            .catch(error => {
                console.error('Erro ao carregar cursos:', error);
            });
    }, []);

    const onTableSearchChange = (e) => {
        const value = e.target.value || '';
        const _filters = { ...filters };
        _filters.global.value = value;
        setFilters(_filters);
        setTableSearchValue(value);
    };

    const renderHeader = (
        <div className="flex justify-content-between">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText value={tableSearchValue} onChange={onTableSearchChange} placeholder="Buscar tema" />
            </IconField>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 mr-2" onClick={() => editAction(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteAction(rowData)} />
            </div>
        );
    };

    const createTheme = () => {
        setDisplayDialog(true);
    };

    const hideDialog = () => {
        setDisplayDialog(false);
        setEditTitulo('');
        setEditDescricao('');
        setSelectedTema(null);
        setTitulo('');
        setDescricao('');
        setCursoSelecionado(null);
    };

    const handleSubmit = async () => {
        console.log('handleSubmit chamado'); // Para depuração
        try {
            // Incluindo o curso selecionado no payload, se necessário
            const data = { titulo, descricao, curso: cursoSelecionado };
            const response = await TccService.createTema(data);
            console.log('Resposta da API:', response);
            fetchSugestoesTcc();
            setDisplayDialog(false);
            setTitulo('');
            setDescricao('');
            setCursoSelecionado(null);
        } catch (error) {
            console.error('Erro ao criar sugestão', error);
        }
    };

    const editAction = (rowData) => {
        setSelectedTema(rowData);
        setEditTitulo(rowData.titulo);
        setEditDescricao(rowData.descricao);
        // Se o tema possuir informação de curso, pode ser pré-selecionado aqui:
        setCursoSelecionado(rowData.curso || null);
        setDisplayDialog(true);
    };

    const handleEditSubmit = async () => {
        try {
            const data = {
                id: selectedTema.id,
                titulo: editTitulo,
                descricao: editDescricao,
                professor: selectedTema.professor.id,
                curso: cursoSelecionado
            };
            await TccService.updateTema(selectedTema.id, data);
            fetchSugestoesTcc();
            setDisplayDialog(false);
            setSelectedTema(null);
            setEditTitulo('');
            setEditDescricao('');
            setCursoSelecionado(null);
        } catch (error) {
            console.error('Erro ao atualizar tema', error);
        }
    };

    const confirmDeleteAction = (rowData) => {
        setThemeToDelete(rowData);
        setDisplayConfirmDialog(true);
    };

    const deleteAction = async () => {
        try {
            await TccService.deleteTema(themeToDelete.id);
            fetchSugestoesTcc();
            setDisplayConfirmDialog(false);
            setThemeToDelete(null);
        } catch (error) {
            console.error('Erro ao excluir tema', error);
        }
    };

    const cancelDeleteAction = () => {
        setDisplayConfirmDialog(false);
        setThemeToDelete(null);
    };

    const renderConfirmDialog = () => {
        return (
            <Dialog header="Confirmação" visible={displayConfirmDialog} style={{ width: '50vw' }} onHide={cancelDeleteAction}>
                <p>Certeza de que deseja excluir o tema?</p>
                <Button label="Sim" className="p-button-success mr-2" onClick={deleteAction} />
                <Button label="Não" className="p-button-danger" onClick={cancelDeleteAction} />
            </Dialog>
        );
    };

    const renderDialog = () => {
        const isEdit = !!selectedTema;

        return (
            <Dialog header={isEdit ? "Editar Tema" : "Criar Tema"} visible={displayDialog} style={{ width: '50vw' }} onHide={hideDialog}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="titulo">Título</label>
                        <InputText
                            id="titulo"
                            value={isEdit ? editTitulo : titulo}
                            onChange={(e) => isEdit ? setEditTitulo(e.target.value) : setTitulo(e.target.value)}
                        />
                    </div>
                    <div className="p-field mt-2">
                        <label htmlFor="descricao">Descrição</label>
                        <InputTextarea
                            id="descricao"
                            value={isEdit ? editDescricao : descricao}
                            onChange={(e) => isEdit ? setEditDescricao(e.target.value) : setDescricao(e.target.value)}
                            rows={3}
                        />
                    </div>
                    {/* Dropdown para seleção do curso */}
                    <div className="p-field mt-2">
                        <label htmlFor="curso">Curso</label>
                        <Dropdown
                            id="curso"
                            value={cursoSelecionado}
                            onChange={(e) => setCursoSelecionado(e.value)}
                            options={cursos}
                            optionLabel="nome" // Supondo que cada objeto de curso tenha a propriedade "nome"
                            placeholder="Selecione um curso"
                            style={{ width: '100%' }}
                        />
                    </div>
                    <Button
                        label={isEdit ? "Salvar" : "Enviar"}
                        className="p-button-success mt-2"
                        onClick={isEdit ? handleEditSubmit : handleSubmit}
                    />
                </div>
            </Dialog>
        );
    };

    const rowExpansionTemplate = (data) => {
        return (
            <div className="p-m-3">
                <h5>Descrição:</h5>
                <textarea value={data.descricao} readOnly rows={5} style={{ width: '100%', minHeight: '150px' }} />
            </div>
        );
    };

    const onRowToggle = (event) => {
        setExpandedRows(event.data);
    };

    if (loading) {
        return <LoadingSpinner />;
    } else {
        return (
            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200 flex flex-col items-center'>
                    <h1 className='heading-1 px-6 text-gray-700'>Minhas Sugestões de Tema</h1>
                    <Button label="Criar Tema" className="p-button-success mb-2" onClick={createTheme} />
                </div>
                <div className='py-6 px-2'>
                    <DataTable
                        value={sugestoes}
                        header={renderHeader}
                        emptyMessage="Nenhum tema encontrado"
                        filters={filters}
                        paginator
                        rows={5}
                        tableStyle={{ minWidth: '50rem' }}
                        rowExpansionTemplate={rowExpansionTemplate}
                        expandedRows={expandedRows}
                        onRowToggle={onRowToggle}
                    >
                        <Column expander style={{ width: '3rem' }}></Column>
                        <Column field="titulo" header="Tema" style={{ width: '77%' }}></Column>
                        <Column field="professor.nome" header="Professor" style={{ width: '20%' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
                {renderDialog()}
                {renderConfirmDialog()}
            </div>
        );
    }
};

SugestoesTemasTccPage.guards = [GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
SugestoesTemasTccPage.title = 'Sugestões de Temas para TCC';

export default SugestoesTemasTccPage;
