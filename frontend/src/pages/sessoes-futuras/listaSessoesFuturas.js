import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import DropdownProfessores from 'meutcc/components/ui/DropdownProfessores';
import SessoesService from 'meutcc/services/SessoesService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

export default function ListaSessoesFuturas() {
    const [sessoes, setSessoes] = useState([]);
    const [sessaoSelecionada, setSessaoSelecionada] = useState(null);
    const [exibirDialogo, setExibirDialogo] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false); // Estado para controlar o modo de edição
    const [sessaoMudancas, SetSessaoMudancas] = useState({
        idSessao: '',
        avaliador1: '',
        avaliador2: '',
        dataInicio: '',
        local: ''
    });

    useEffect(() => {
        fetchSessoesFuturas();
    }, []);

    const fetchSessoesFuturas = async () => {
        try {
            const sessoesFuturas = await SessoesService.getSessoesPendentes();
            setSessoes(sessoesFuturas);
            handleApiResponse(response);
        } catch (error) {
            handleApiResponse(error.response);
            console.error('Erro ao obter sessões:', error);
        }
    };

    const abrirDialogo = (sessao) => {
        setSessaoSelecionada(sessao);
        SetSessaoMudancas({
            ...sessaoMudancas,
            idSessao: sessao.id,
            avaliador1: sessao.banca.professores[0].id,
            avaliador2: sessao.banca.professores[1].id,
            local: sessao.local,
            dataInicio: new Date(sessao.data_inicio)
        })

        setExibirDialogo(true);
    };

    const fecharDialogo = () => {
        setExibirDialogo(false);
        setModoEdicao(false); // Resetando o modo de edição ao fechar o diálogo
    };

    const handleConfirmarSessao = async () => {
        try {
            await SessoesService.putEditarSessao(sessaoMudancas);

            fetchSessoesFuturas();
            fecharDialogo();
            handleApiResponse(response);
        } catch (error) {
            handleApiResponse(error.response);
            console.error('Erro ao editar sessão:', error);

        }
    };

    const footerContent = (
        <div className='flex items-center justify-between gap-4'>
            <div className='w-1/2'>
                <Button className='w-full' label={modoEdicao ? "Cancelar Edição" : "Editar Sessão"} severity={modoEdicao ? "secondary" : "warning"} icon={modoEdicao ? 'pi pi-times' : 'pi pi-pencil'} iconPos='right' onClick={() => setModoEdicao(!modoEdicao)} /> {/* Alterado para ativar ou desativar o modo de edição */}
            </div>
            <div className='w-1/2'>
                <div>
                    <Button className='w-full' label="Confirmar Sessão" severity="success" icon='pi pi-check' iconPos='right' onClick={handleConfirmarSessao} />
                </div>
            </div>
        </div>
    );

    const dataInicioTemplate = (rowData) => {
        const data = new Date(rowData.data_inicio);
        const dataFormatada = format(data, "dd/MM/yyyy 'às' HH:mm");
        return dataFormatada;
    };

    const validacaoCoordenadorTemplate = (rowData) => {
        return (
            <Tag className={rowData.validacaoCoordenador ? 'p-tag-success' : 'p-tag-warning'} icon={rowData.validacaoCoordenador ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'}>
                {rowData.validacaoCoordenador ? 'Agendado' : 'Não Agendado'}
            </Tag>
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <>
                {rowData.validacaoCoordenador ? (
                    <Button label="Editar" icon='pi pi-pencil' className="p-button-outlined" onClick={() => abrirDialogo(rowData)} />
                ) : (
                    <Button label="Agendar" icon='pi pi-search' severity="warning" onClick={() => abrirDialogo(rowData)} />
                )}
            </>
        );
    };

    return (
        <div>
            <div className="card">
                <DataTable value={sessoes} selection={sessaoSelecionada} dataKey="id" paginator rows={5} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions">
                    <Column field="tcc.autor.nome" header="Autor" sortable />
                    <Column field="tipo" header="Tipo" sortable />
                    <Column field="data_inicio" header="Data e Hora" body={dataInicioTemplate} sortable />
                    <Column header="Revisado" body={validacaoCoordenadorTemplate} />
                    <Column body={actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
            </div>

            <Dialog visible={exibirDialogo} style={{ width: '32rem' }} header="Detalhes da Sessão" modal footer={footerContent} onHide={fecharDialogo}>
                <div className="font-bold p-fluid">
                    <div className='px-5 py-3 text-gray-700 border border-gray-200 border-solid rounded-lg shadow-md shadow-gray-300'>
                        <div className="my-2 font-bold p-field">
                            <label htmlFor="tipo">Tipo: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tipo}</span>
                        </div>
                        <div className="my-2 font-bold p-field">
                            <label htmlFor="tema">Tema: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.tema}</span>
                        </div>
                        <div className="my-2 font-bold p-field">
                            <label htmlFor="autor">Autor: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.autor.nome}</span>
                        </div>
                        <div className="my-2 font-bold p-field">
                            <label htmlFor="orientador">Orientador: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.orientador.nome}</span>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className="my-2 p-field">
                            <label htmlFor="membroBanca1">Avaliador 1:</label>
                            <DropdownProfessores disabled={!modoEdicao} value={sessaoMudancas.avaliador1} onChange={(e) => SetSessaoMudancas({ ...sessaoMudancas, avaliador1: e.target.value })} />

                        </div>
                        <div className="my-2 p-field">
                            <label htmlFor="membroBanca2">Avaliador 2:</label>
                            <DropdownProfessores disabled={!modoEdicao} value={sessaoMudancas.avaliador2} onChange={(e) => SetSessaoMudancas({ ...sessaoMudancas, avaliador2: e.target.value })} />
                        </div>
                        <div className='flex justify-between gap-32'>
                            <div className="my-2 p-field">
                                <label htmlFor="data">Data:</label>
                                <Calendar id="dataSessao"
                                    value={sessaoMudancas.dataInicio}
                                    onChange={(e) => SetSessaoMudancas({ ...sessaoMudancas, dataInicio: e.target.value })}
                                    dateFormat='dd/mm/yy'
                                    className=''
                                    showButtonBar
                                    locale='ptbr'
                                    showIcon={modoEdicao}
                                    disabled={!modoEdicao}
                                />
                            </div>
                            <div className="my-2 p-field">
                                <label htmlFor="hora">Hora:</label>
                                <Calendar id="horaSessao"
                                    value={sessaoMudancas.dataInicio}
                                    onChange={(e) => SetSessaoMudancas({ ...sessaoMudancas, dataInicio: e.target.value })}
                                    timeOnly
                                    showIcon={modoEdicao}
                                    disabled={!modoEdicao} />
                            </div>
                        </div>
                        <div className="my-2 p-field">
                            <label htmlFor="local">Local:</label>
                            <InputText id="local" value={sessaoMudancas.local} onChange={(e) => sessaoMudancas.local(e.value)} disabled={!modoEdicao} />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
