import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { GUARDS } from 'meutcc/core/constants';
import TccService from 'meutcc/services/TccService';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

const SugestoesTemasTccPage = () => {

    const [loading, setLoading] = React.useState(false);
    const [filters, setFilters] = React.useState({});
    const [tableSearchValue, setTableSearchValue] = React.useState('');

    const [expandedRows, setExpandedRows] = useState(null);

    const [sugestoes, setSugestoes] = React.useState([]);

    const initFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS }
        });
    };

    const fetchSugestoesTcc = async () => {
        setLoading(true);
        try {
            const data = await TccService.getSugestoes();
            console.log(data);
            setSugestoes(data);
            handleApiResponse(response);
        } catch (error) {
            handleApiResponse(error.response);
        }
        setLoading(false);
    };

    React.useEffect(() => {
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

    const renderHeader = (<div>
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search ml-2" />
                <InputText value={tableSearchValue} onChange={onTableSearchChange} placeholder="Buscar tema" className='pl-7'/>
            </span>
        </div>
    </div>);

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

    // const DataTableSugestoes = () => {
    //     return (
    //         <div className='py-6 px-2'>
    //         <DataTable value={sugestoes} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }} rowExpansionTemplate={rowExpansionTemplate} expandedRows={expandedRows} onRowToggle={onRowToggle}>
    //             <Column expander style={{ width: '3rem' }}></Column>
    //             <Column field="titulo" header="Tema" style={{ width: '77%' }}></Column>
    //             <Column field="professor.nome" header="Professor" style={{ width: '20%' }}></Column>
    //         </DataTable>
    //         </div>
    //     );
    // };

    if(loading){
        return <LoadingSpinner />;
    }else{
        return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
            <h1 className='heading-1 px-6 text-gray-700'>Sugestões de temas para TCC</h1>
        </div>
        <div className='py-6 px-2'>
            <DataTable value={sugestoes} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }} rowExpansionTemplate={rowExpansionTemplate} expandedRows={expandedRows} onRowToggle={onRowToggle}>
                <Column expander style={{ width: '3rem' }}></Column>
                <Column field="titulo" header="Tema" style={{ width: '77%' }}></Column>
                <Column field="professor.nome" header="Professor" style={{ width: '20%' }}></Column>
            </DataTable>
            </div>
        </div>;
    }
}

SugestoesTemasTccPage.title = 'Sugestões de Temas para TCC';

export default SugestoesTemasTccPage;