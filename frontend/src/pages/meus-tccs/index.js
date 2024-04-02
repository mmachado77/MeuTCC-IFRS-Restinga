import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import TccService from 'meutcc/services/TccService';
import { Button } from 'primereact/button';


const MeusTccsPage = () => {

    const [filters, setFilters] = React.useState({});
    const [tableSearchValue, setTableSearchValue] = React.useState('');

    const [tccs, setTccs] = React.useState([]);

    const initFilters = () => {
        setFilters({
            global: { value: '', matchMode: FilterMatchMode.CONTAINS }
        });
    };

    const fetchTccs = async () => {
        try {
            const data = await TccService.getTccs();
            setTccs(data);

        } catch (error) {
            console.error('Erro ao buscar os TCCs', error);
        }
    };

    React.useEffect(() => {
        fetchTccs();
        initFilters();
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
                <i className="pi pi-search" />
                <InputText value={tableSearchValue} onChange={onTableSearchChange} placeholder="Buscar tema" />
            </span>
        </div>

    </div>);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-center">
                <Button type="button" icon="pi pi-cog" rounded></Button>
            </div>
        );
    }

    return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
            <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
        </div>

        <div className='py-6 px-2'>
            <DataTable value={tccs} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
                <Column field="tema" header="Título" style={{ width: '80%' }}></Column>
                <Column field="orientador.nome" header="Orientador" style={{ width: '20%' }}></Column>

                {tccs.some(tcc => tcc.coorientador) && <Column field="coorientador.nome" header="Coorientador" style={{ width: '20%' }}></Column>}
                
                <Column field="tema" header="Detalhes" style={{ width: '20%' }}></Column>
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
            </DataTable>
        </div>
    </div>;

}

export default MeusTccsPage;