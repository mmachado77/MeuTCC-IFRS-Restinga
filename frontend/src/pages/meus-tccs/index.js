
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { GUARDS } from 'meutcc/core/constants';
import { set } from 'date-fns';

import React from 'react';
import TccService from 'meutcc/services/TccService';
import Link from 'next/link';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';


const MeusTccsPage = () => {

    const [loading, setLoading] = React.useState(false);
    const [possuiProposta, setPossuiProposta] = React.useState(false);
    const [filters, setFilters] = React.useState({});
    const [tableSearchValue, setTableSearchValue] = React.useState('');
    const [expandedRows, setExpandedRows] = React.useState({});
    
    const [tccs, setTccs] = React.useState([]);

    const fetchJaPossuiProposta = async () => {

        setLoading(true);
        try {
            const data = await TccService.getPossuiTcc();
            console.log(data.value);
    
            if (data.possuiProposta == true) {
                setPossuiProposta(true);
            }
            setLoading(false);

        } catch (error) {
            console.error('Erro ao buscar propostas existentes', error);
        }
    }

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
        fetchJaPossuiProposta();
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
                <Link label="Detalhes" href=""> <Button label="Detalhes" icon='pi pi-search-plus' severity="success" outlined/> </Link>
            </div>
        );
    }

    const coorientadorTemplate = (rowData) => {
        return rowData.coorientador && rowData.coorientador.nome || 'Sem coorientador';
    }

    // Place holder para eventos de expansão de linhas
    const onRowToggle = (e) => {
        setExpandedRows(e.data);
    }
    
    const onRowExpand = (e) => {
        console.log('Row Expanded', e.data);
    }
    
    const onRowCollapse = (e) => {
        console.log('Row Collapsed', e.data);
    }

    const allowExpansion = true;

    const rowExpansionTemplate = (data) => {
        return (
            <div>
                <h4>Resumo:</h4>
                <p>{data.resumo}</p>
            </div>
        );
    }

   if(loading){
        return <LoadingSpinner />;
    }

    if(possuiProposta){
        return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
            </div>

            <div className='py-6 px-2'>

                {/*<DataTable value={tccs} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>*/}
                <DataTable value={tccs} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id" header={renderHeader} tableStyle={{ minWidth: '60rem' }}>
                    
                    <Column field="tema" header="Título" style={{ width: '80%' }}></Column>
                    <Column field="orientador.nome" header="Orientador" style={{ width: '20%' }}></Column>
                    <Column body={coorientadorTemplate} header="Coorientador" style={{ width: '20%' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    <Column expander={allowExpansion} style={{ width: '5rem' }} />
                </DataTable>
            </div>
        </div>;
    }else{
        return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
            </div>
            <div className='py-6 px-2'>
                <h2 className='heading-1 px-6 text-gray-700 text-center'>Você ainda não submeteu uma proposta de TCC</h2>
            </div>
            <div className='flex justify-center pb-10'>
                <Link href="/submeter-proposta">
                    <Button label="Submeter Proposta" icon='pi pi-plus' className='w-full' />
                </Link>
            </div>
        </div>;
    }

}

MeusTccsPage.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
MeusTccsPage.title = 'Meus TCCs';

export default MeusTccsPage;