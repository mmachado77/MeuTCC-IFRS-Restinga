import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { GUARDS } from 'meutcc/core/constants';
import TccService from 'meutcc/services/TccService';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

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

    const initFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS }
        });
    };

    const fetchSugestoesTcc = async () => {
        setLoading(true);
        try {
            const data = await TccService.getMinhasSugestoes();
            setSugestoes(data);
        } catch (error) {
            console.error('Erro ao buscar as sugestoes de temas', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        initFilters();
        fetchSugestoesTcc();
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
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={tableSearchValue} onChange={onTableSearchChange} placeholder="Buscar tema" />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editAction(rowData)} />
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
    };

    const handleSubmit = async () => {
        try {
            const data = { titulo, descricao };
            await TccService.createTema(data);
            fetchSugestoesTcc();
            setDisplayDialog(false);
            setTitulo('');
            setDescricao('');
        } catch (error) {
            console.error('Erro ao criar sugestão', error);
        }
    };

    const editAction = (rowData) => {
        setSelectedTema(rowData);
        setEditTitulo(rowData.titulo);
        setEditDescricao(rowData.descricao);
        setDisplayDialog(true);
    };

    const handleEditSubmit = async () => {
        try {
            const data = {
                id: selectedTema.id,
                titulo: editTitulo,
                descricao: editDescricao,
                professor: selectedTema.professor.id,
            };
            await TccService.updateTema(selectedTema.id, data);
            fetchSugestoesTcc();
            setDisplayDialog(false);
            setSelectedTema(null);
            setEditTitulo('');
            setEditDescricao('');
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
                <Button label="Sim" className="p-button-success" onClick={deleteAction} />
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
                        <InputText id="titulo" value={isEdit ? editTitulo : titulo} onChange={(e) => isEdit ? setEditTitulo(e.target.value) : setTitulo(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="descricao">Descrição</label>
                        <InputTextarea id="descricao" value={isEdit ? editDescricao : descricao} onChange={(e) => isEdit ? setEditDescricao(e.target.value) : setDescricao(e.target.value)} rows={3} />
                    </div>
                    <Button label={isEdit ? "Salvar" : "Enviar"} className="p-button-success" onClick={isEdit ? handleEditSubmit : handleSubmit} />
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

    const DataTableSugestoes = () => {
        return (
            <div className='py-6 px-2'>
            <DataTable value={sugestoes} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }} rowExpansionTemplate={rowExpansionTemplate} expandedRows={expandedRows} onRowToggle={onRowToggle}>
                <Column expander style={{ width: '3rem' }}></Column>
                <Column field="titulo" header="Tema" style={{ width: '77%' }}></Column>
                <Column field="professor.nome" header="Professor" style={{ width: '20%' }}></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
            </div>
        );
    };

    if (loading) {
        return <LoadingSpinner />;
    } else {
        return (
            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200 flex flex-col items-center'>
                    <h1 className='heading-1 px-6 text-gray-700'>Minhas Sugestões de Tema</h1>
                    <Button label="Criar Tema" className="p-button-success mt-4" onClick={createTheme} />
                </div>
                <DataTableSugestoes />
                {renderDialog()}
                {renderConfirmDialog()}
            </div>
        );
    }
};

SugestoesTemasTccPage.guards = [GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
SugestoesTemasTccPage.title = 'Sugestões de Temas para TCC';

export default SugestoesTemasTccPage;