import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import ConfiguracoesService from 'meutcc/services/ConfiguracoesService';
import { format, parseISO } from 'date-fns';
import { TabView, TabPanel } from 'primereact/tabview';
import toast from 'react-hot-toast';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import { GUARDS } from 'meutcc/core/constants';
import AtualizarCoordenador from 'meutcc/pages/painel-configuracoes/selecionar-coordenador';
import { Card } from 'primereact/card';

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});

const ConfiguracoesPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [semestreAtual, setSemestreAtual] = useState(null);

    async function fetchSemestreAtual() {
        try {
            const response = await ConfiguracoesService.getSemestreAtual();
            setSemestreAtual(response); 
            setStartDate(parseISO(response.dataAberturaPrazoPropostas))
            setEndDate(parseISO(response.dataFechamentoPrazoPropostas))
        } catch (error) {
            console.error('Erro ao buscar o semestre atual:', error);
        }
    }

    useEffect(() => {
        fetchSemestreAtual();
    }, []);

    const handleSaveDates = async () => {
        console.log('Data de Início:', startDate);
        console.log('Data de Fim:', endDate);
        const datas = {
            dataAberturaPrazoPropostas: format(startDate, 'yyyy-MM-dd'),
            dataFechamentoPrazoPropostas: format(endDate, 'yyyy-MM-dd')
        }
        const data = await toast.promise(ConfiguracoesService.atualizaDataProposta(datas), {
            loading: 'Atualizando...',
            success: 'Prazo Alterado com Sucesso!',
            error: 'Erro ao Atualizar',
        });
    };

    return (
        <div>
            <div className='max-w-screen-md mx-auto bg-white m-3 mt-6'>
                <div className="card">
                            {semestreAtual && (
                                <div>
                                    <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                                        <h1 className='text-center text-gray-700 mb-2'>Semestre Atual: {semestreAtual.periodo}</h1>
                                        <div className='flex justify-center'>
                                        <div>
                                            <label htmlFor="inicio" className="font-bold text-gray-700">Início: </label>
                                            <span className='text-gray-700'>{semestreAtual.dataAberturaSemestre && format(parseISO(semestreAtual.dataAberturaSemestre), 'dd/MM/yyyy')}</span>
                                        </div>
                                        <div className='py-3 border-0 border-r border-dashed border-gray-200 mr-12 ml-12'></div>
                                        <div>
                                            <label htmlFor="final" className="font-bold text-gray-700">Final: </label>
                                            <span className='text-gray-700'>{semestreAtual.dataFechamentoSemestre && format(parseISO(semestreAtual.dataFechamentoSemestre), 'dd/MM/yyyy')}</span>
                                        </div>
                                        </div>
                                     </div>
                                    <div className="flex justify-around mb-5 mt-0">
                                        <TabView >
                                            <TabPanel header="Coordenador de Curso" leftIcon="pi pi-user-edit mr-2" >
                                            <div>
                                            <h2 className='text-center text-gray-700 mb-2 mt-0'>Coordenador do Curso</h2>
                                                <div className='flex justify-between items-center mt-5 p-2 border border-dashed border-gray-200 rounded-lg'>
                                                    <div>
                                                    <div className='block'>
                                                    <label htmlFor="coordenador" className="font-bold text-gray-700 text-lg">Coordenador Atual: </label>
                                                    <span className='text-gray-700'>{semestreAtual.semestreCoordenador.coordenador_nome}</span>
                                                    </div>
                                                    <div className='block'>
                                                    <label htmlFor="dataCoordenador" className="font-bold text-gray-700 text-lg">Data de Alteração: </label>
                                                    <span className='text-gray-700'>{semestreAtual.semestreCoordenador.dataAlteracao && format(parseISO(semestreAtual.semestreCoordenador.dataAlteracao), 'dd/MM/yyyy')}</span>
                                                    </div>
                                                    </div>
                                                    <div>
                                                    <Button label="Ver Histórico" severity="warning" className="" icon='pi pi-history' iconPos='right' outlined/>
                                                    </div>
                                                    </div>
                                                    <div>
                                                    <AtualizarCoordenador />
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel header="Prazo Envio de Propostas" leftIcon="pi pi-calendar mr-2" >
                                            <div className="flex justify-around mb-5">
                                                <div>
                                                    <div className=''>
                                                    <label>Data de Abertura do Prazo:</label>
                                                    <Calendar
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.value)}
                                                        dateFormat='dd/mm/yy'
                                                        readOnlyInput
                                                        showButtonBar
                                                        locale='ptbr'
                                                        showIcon
                                                    />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className=''>
                                                    <label>Data de Fechamento do Prazo:</label>
                                                    <Calendar
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.value)}
                                                        dateFormat='dd/mm/yy'
                                                        readOnlyInput
                                                        showButtonBar
                                                        locale='ptbr'
                                                        showIcon
                                                    />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=''>
                                                    <Button label="Salvar Alterações" severity="success" className='w-full' onClick={handleSaveDates} />
                                            </div>
                                            </TabPanel>
                                            <TabPanel header="Semestres" leftIcon="pi pi-calendar-plus mr-2" >
                                                <div className='w-full'>
                                                    <p>oi</p>
                                                </div>
                                            </TabPanel>
                                        </TabView>
                                    </div> 
                                </div>
                            )}
                </div>
            </div>
        </div>
    );
};

ConfiguracoesPage.guards = [GUARDS.COORDENADOR];
ConfiguracoesPage.title = 'Configurações';

export default ConfiguracoesPage;
