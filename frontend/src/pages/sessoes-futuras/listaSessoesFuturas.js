import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import SessoesService from 'meutcc/services/SessoesService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';

export default function ListaSessoesFuturas() {
    const [sessoes, setSessoes] = useState([]);
    const [sessaoSelecionada, setSessaoSelecionada] = useState(null);
    const [exibirDialogo, setExibirDialogo] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false); // Estado para controlar o modo de edição

    const footerContent = (
        <div>
            <div>
                <Button className='w-full' label={modoEdicao ? "Cancelar Edição" : "Editar"} severity={modoEdicao ? "secondary" : "warning"} icon={modoEdicao ? 'pi pi-times' : 'pi pi-pencil'} iconPos='right' onClick={() => setModoEdicao(!modoEdicao)} /> {/* Alterado para ativar ou desativar o modo de edição */}
            </div>
            <div className='flex justify-between mt-3'>
                <div>
                    <Button label="Confirmar Sessão" severity="success" icon='pi pi-check' iconPos='right' onClick='' />
                </div>
                <div>
                    <Button label="Cancelar" severity="secondary" icon='pi pi-times' iconPos='right' onClick={() => setExibirDialogo(false)} />
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        fetchSessoesFuturas();
    }, []);

    const fetchSessoesFuturas = async () => {
        try {
            const sessoesFuturas = await SessoesService.getSessoesPendentes();
            setSessoes(sessoesFuturas);
        } catch (error) {
            console.error('Erro ao obter sessões:', error);
        }
    };

    const abrirDialogo = (sessao) => {
        setSessaoSelecionada(sessao);
        setExibirDialogo(true);
    };

    const fecharDialogo = () => {
        setExibirDialogo(false);
        setModoEdicao(false); // Resetando o modo de edição ao fechar o diálogo
    };

    const dataInicioTemplate = (rowData) => {
        const data = new Date(rowData.data_inicio);
        const dataFormatada = format(data, "dd/MM/yyyy 'às' HH:mm");
        return dataFormatada;
    };

    const validacaoCoordenadorTemplate = (rowData) => {
        return (
            <Tag className={rowData.validacaoCoordenador ? 'p-tag-success' : 'p-tag-warning'} icon={rowData.validacaoCoordenador ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'}>
                {rowData.validacaoCoordenador ? 'Revisado' : 'Não Revisado'}
            </Tag>
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <>
                {rowData.validacaoCoordenador ? (
                    <Button label="Editar" icon='pi pi-pencil' className="p-button-outlined" onClick={() => abrirDialogo(rowData)} />
                ) : (
                    <Button label="Revisar" icon='pi pi-search' severity="warning" onClick={() => abrirDialogo(rowData)} />
                )}
            </>
        );
    };

    const dataInicio = sessaoSelecionada?.data_inicio ? new Date(sessaoSelecionada.data_inicio) : null;
    const dataFormatada = dataInicio ? format(dataInicio, "dd/MM/yyyy") : '';
    const horaFormatada = sessaoSelecionada?.data_inicio ? format(new Date(sessaoSelecionada.data_inicio), 'HH:mm') : '';

    return (
        <div>
            <div className="card">
                <DataTable value={sessoes} selection={sessaoSelecionada} onSelectionChange={(e) => setSessaoSelecionada(e.value)} dataKey="id" paginator rows={5} currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions">
                    <Column field="tcc.autor.nome" header="Autor" sortable />
                    <Column field="tipo" header="Tipo" sortable />
                    <Column field="data_inicio" header="Data e Hora" body={dataInicioTemplate} sortable />
                    <Column header="Revisado" body={validacaoCoordenadorTemplate} />
                    <Column body={actionTemplate} style={{ textAlign: 'center', width: '8em' }} />
                </DataTable>
            </div>

            <Dialog visible={exibirDialogo} style={{ width: '32rem' }} header="Detalhes da Sessão" modal footer={footerContent} onHide={fecharDialogo}>
                <div className="p-fluid font-bold">
                    <div className='shadow-md shadow-gray-300 border border-solid border-gray-200 px-5 py-3 rounded-lg text-gray-700'>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="tipo">Tipo: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tipo}</span>
                        </div>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="tema">Tema: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.tema}</span>
                        </div>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="autor">Autor: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.autor.nome}</span>
                        </div>
                        <div className="p-field my-2 font-bold">
                            <label htmlFor="orientador">Orientador: </label>
                            <span className='font-normal'>{sessaoSelecionada?.tcc.orientador.nome}</span>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div className="p-field my-2">
                            <label htmlFor="membroBanca1">Professor 1:</label>
                            <InputText id="membroBanca1" value={sessaoSelecionada?.banca.professores[0].nome} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, banca: { ...sessaoSelecionada.banca, professores: [e.target.value, sessaoSelecionada.banca.professores[1]] } })} readOnly={!modoEdicao} />
                        </div>
                        <div className="p-field my-2">
                            <label htmlFor="membroBanca2">Professor 2:</label>
                            <InputText id="membroBanca2" value={sessaoSelecionada?.banca.professores[1].nome} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, banca: { ...sessaoSelecionada.banca, professores: [sessaoSelecionada.banca.professores[0], e.target.value] } })} readOnly={!modoEdicao} />
                        </div>
                        <div className='flex justify-between gap-32'>
                            <div className="p-field my-2">
                                <label htmlFor="data">Data:</label>
                                <InputText id="data" value={dataFormatada} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, data_inicio: e.target.value })} readOnly={!modoEdicao} />
                            </div>
                            <div className="p-field my-2">
                                <label htmlFor="hora">Hora:</label>
                                <InputText id="hora" value={horaFormatada} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, hora: e.target.value })} readOnly={!modoEdicao} />
                            </div>
                        </div>
                        <div className="p-field my-2">
                            <label htmlFor="local">Local:</label>
                            <InputText id="local" value={sessaoSelecionada?.local} onChange={(e) => setSessaoSelecionada({ ...sessaoSelecionada, local: e.target.value })} readOnly={!modoEdicao} />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
