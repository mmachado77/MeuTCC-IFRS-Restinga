import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { GUARDS } from 'meutcc/core/constants';
import TccService from 'meutcc/services/TccService';
import LoadingSpinner from 'meutcc/components/ui/LoadingSpinner';

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

        } catch (error) {
            console.error('Erro ao buscar as sugestoes de temas', error);
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

    /*
    const customers = [
        { tema: 'Ensino de lógica com Robótica educacional', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Ensino de lógica com Programação de Jogos', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Jogos educacionais para conteúdo especifíco', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Sistema de solicitações de documentos acadêmicos', professor: 'Coordenação ADS', area: 'Gestão de Processos' },
        { tema: 'ferramenta de comunição de lembretes para datas do calendario academico', professor: 'Coordenação ADS', area: 'Gestão de Processos' },
        { tema: 'Desenvolvimento de soluções (sistemas) relacionadas a sua ocupação profissional.', professor: 'Coordenação ADS', area: 'Gestão de Processos' },
        { tema: 'Sistema para coleta e processamento de informações para os censos escolares.', professor: 'Coordenação ADS', area: 'Gestão de Processos' },
        { tema: 'ABCash:Jogo digital para educação financeira', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Aplicativo mobile local para incentivo de práticas esportivas', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Game para ensino de química', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Game para ensino de história', professor: 'Iuri', area: 'Programação / Sistemas EmbarcADOS / Inteligência Artificial' },
        { tema: 'Sistema de elaboração e acompanhamento da execução dos planos de ações do Campus Restinga.', professor: 'Gleison', area: 'Programação Web / Gestão de Serviços e Processos / Banco de Dados' },
        { tema: 'Documentação e automação de processos de trabalho do campus restinga através de um motor de execução de processos (BPM)', professor: 'Gleison', area: 'Programação Web / Gestão de Serviços e Processos / Banco de Dados' },
        { tema: 'Testes em Smart Contracts (Blockchain Ethereum)', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Testes de segurança (PENTEST) e avaliação de segurança de sistemas e dispositivos IoT', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Avaliação de Linguagem de programação do Plano de Dados em SDN', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Aplicativo mobile para avaliação, catalogação, e edição específica para coleções (discos, bebidas, action figure, gibis, etc) e integração com base dados existentes (ex: Discogs, Vivino, Distiller', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Alumni IFRS - Sistema para cadastro/contato/gamificação com/para egressos do IFRS', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Avaliação de honeypots com IA', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Intranet do Campus Restinga', professor: 'Roben/Gleison', area: 'Programação Web / Gestão de Serviços e Processos / Banco de Dados' },
        { tema: 'Testes (funcional, performance, segurança, etc) em sistemas internos do Campus Restinga', professor: 'Roben', area: 'Redes de Computadores / Segurança de Sistemas' },
        { tema: 'Sistema de gerenciamento de estágios (WEB)', professor: 'Coordenação ADS', area: 'Gestão de Processos' },
        { tema: 'Desenvolvimento de soluções utilizando o Meta Quest 2', professor: 'Jean', area: 'Redes de Computadores / Hardware' },
    ];
    */

    const renderHeader = (<div>
        <div className="flex justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={tableSearchValue} onChange={onTableSearchChange} placeholder="Buscar tema" />
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

    const DataTableSugestoes = () => {
        return (
            <div className='py-6 px-2'>
            <DataTable value={sugestoes} header={renderHeader} emptyMessage="Nenhum tema encontrado" filters={filters} paginator rows={5} tableStyle={{ minWidth: '50rem' }} rowExpansionTemplate={rowExpansionTemplate} expandedRows={expandedRows} onRowToggle={onRowToggle}>
                <Column expander style={{ width: '3rem' }}></Column>
                <Column field="titulo" header="Tema" style={{ width: '77%' }}></Column>
                <Column field="professor.nome" header="Professor" style={{ width: '20%' }}></Column>
            </DataTable>
            </div>
        );
    };

    if(loading){
        return <LoadingSpinner />;
    }else{
        return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
        <div className='py-3 border-0 border-b border-dashed border-gray-200'>
            <h1 className='heading-1 px-6 text-gray-700'>Sugestões de temas para TCC</h1>
        </div>
            <DataTableSugestoes />
        </div>;
    }
}

SugestoesTemasTccPage.title = 'Sugestões de Temas para TCC';

export default SugestoesTemasTccPage;