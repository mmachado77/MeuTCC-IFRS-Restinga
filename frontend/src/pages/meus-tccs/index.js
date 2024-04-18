
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { GUARDS } from 'meutcc/core/constants';
import { set } from 'date-fns';
import { Tag } from 'primereact/tag';

import { useAuth } from "meutcc/core/context/AuthContext";

import React from 'react';
import TccService from 'meutcc/services/TccService';
import Link from 'next/link';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';
import getClassForStatus from 'meutcc/core/utils/corStatus';



const MeusTccsPage = () => {

    const { user } = useAuth();

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

    const statusPriority = {
        'PROPOSTA_ANALISE_PROFESSOR': 1,
        'PROPOSTA_ANALISE_COORDENADOR': 2,
        'DESENVOLVIMENTO': 3,
        'PREVIA': 4,
        'FINAL': 5,
        'AJUSTE': 6,
        'PROPOSTA_RECUSADA_PROFESSOR': 7,
        'PROPOSTA_RECUSADA_COORDENADOR': 8,
        'REPROVADO_PREVIA': 9,
        'REPROVADO_FINAL': 10,
        'APROVADO': 11
    };

    const fetchTccs = async () => {

        setLoading(true);
        let data;
        try {
            if (user.resourcetype == 'ProfessorExterno' || user.resourcetype == 'ProfessorInterno') {
                data = await TccService.getTccsByOrientador();
            }else if(user.resourcetype == 'Estudante') {
                data = await TccService.getTccsByAluno();
            }else if(user.resourcetype == 'Coordenador'){
                data = await TccService.getTccsCoordenacao();
                if (data) {
                    data.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
                }
            }
            setTccs(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar os TCCs', error);
        }
    };

    React.useEffect(() => {
        if(user.resourcetype == 'Estudante'){
            fetchJaPossuiProposta();
        }
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

    const coorientadorTemplate = (rowData) => {
        return rowData.coorientador && rowData.coorientador.nome || 'Sem coorientador';
    }

    const statusBodyTemplate = (rowData) => {
        return <Tag value={getClassForStatus(rowData?.status?.[rowData.status.length - 1]?.status).status} style={{ backgroundColor: getClassForStatus(rowData?.status?.[rowData.status.length - 1]?.status).cor}}></Tag>
    }

    // Eventos de expansão de linhas

    const allowExpansion = true;

    const onRowToggle = (e) => {
        setExpandedRows(e.data);
    }
    
    const onRowExpand = (e) => {
        console.log('Row Expanded', e.data);
    }
    
    const onRowCollapse = (e) => {
        console.log('Row Collapsed', e.data);
    }

    const rowExpansionTemplate = (data) => {
        return (
            <div>
                <h4>Resumo:</h4>
                <p>{data.resumo}</p>
                <div className="flex justify-content-left">
                    <Link label="Detalhes" href={`/detalhes-tcc/${data.id}`}> <Button label="Detalhes" icon='pi pi-external-link' iconPos='right' severity="success" /> </Link>
                </div>
            </div>
        );
    }

    const AbrirProposta = () => {
        return(
            <>
                <div className='py-6 px-2'>
                    <h2 className='heading-1 px-6 text-gray-700 text-center'>Você não possui uma proposta de TCC ativa</h2>
                </div>
                <div className='flex justify-center pb-10'>
                    <Link href="/submeter-proposta">
                        <Button label="Submeter Proposta" icon='pi pi-plus' iconPos='right' className='w-full' severity="success"/>
                    </Link>
                </div>
            </>
        );
    }

    const customCollapsedIcon = <i className="pi pi-angle-down"></i>;
    const customExpandedIcon = <i className="pi pi-angle-up"></i>;

    const DataTableMeusTccs = () => {
        return (
            <div className='py-6 px-2'>
                {/*<DataTable value={tccs} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>*/}
                <DataTable value={tccs} filters={filters} globalFilter={tableSearchValue} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id" header={renderHeader} tableStyle={{ minWidth: '50rem' }} emptyMessage="Nenhum tema encontrado" paginator rows={5}
                expandedRowIcon={customExpandedIcon} collapsedRowIcon={customCollapsedIcon}>   
                    <Column field="tema" header="Título" style={{ width: '80%' }}></Column>

                    {(user.resourcetype === 'Coordenador' || user.resourcetype === 'ProfessorInterno' || user.resourcetype === 'ProfessorExterno') && 
                        <Column field="autor.nome" header="Aluno" style={{ width: '20%' }}></Column>
                    }

                    <Column field="orientador.nome" header="Orientador" style={{ width: '20%' }}></Column>
                    <Column body={coorientadorTemplate} header="Coorientador" style={{ width: '20%' }}></Column>
                    <Column body={statusBodyTemplate} header="Status" style={{ width: '10%' }} filter filterMatchMode='contains'></Column>
                    {/*<Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>*/}
                    <Column expander={allowExpansion} style={{ width: '5rem' }} />
                </DataTable>
            </div>
        );
    }

   if(loading){
        return <LoadingSpinner />;
    }

    if(user.resourcetype == 'Estudante'){
        if(possuiProposta){
            return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
                </div>
                    <DataTableMeusTccs />
            </div>;
        }else{
            return(
                tccs.length > 0 ? (
                    <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                            <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
                        </div>
                        <AbrirProposta />
                        <DataTableMeusTccs />
                    </div>
                    
                ) : (
                    <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                            <h1 className='heading-1 px-6 text-gray-700'>Meus TCCs</h1>
                        </div>
                        <AbrirProposta />
                    </div>
                )
            )
        }
    }

    if(user.resourcetype == 'ProfessorExterno' || user.resourcetype == 'ProfessorInterno' || user.resourcetype == 'Coordenador'){
        if(tccs.length == 0){
            return (
                <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
                    <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                        <h1 className='heading-1 px-6 text-gray-700'>{user.resourcetype === 'Coordenador' ? 'TCCs' : 'Meus TCCs'}</h1>
                    </div>
                    <div className='py-6 px-2'>
                        <h2 className='heading-1 px-6 text-gray-700 text-center'>Nenhum TCC encontrado</h2>
                    </div>
                </div>
            );
        }
        return (
            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 px-6 text-gray-700'>{user.resourcetype === 'Coordenador' ? 'TCCs' : 'Meus TCCs'}</h1>
            </div>
                <DataTableMeusTccs />
            </div>
        );

    }
}

MeusTccsPage.guards = [GUARDS.ESTUDANTE, GUARDS.PROFESSOR_INTERNO, GUARDS.PROFESSOR_EXTERNO, GUARDS.COORDENADOR];
MeusTccsPage.title = 'Meus TCCs';

export default MeusTccsPage;