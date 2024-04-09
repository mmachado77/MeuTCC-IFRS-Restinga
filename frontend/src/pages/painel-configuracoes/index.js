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

    useEffect(() => {
        async function fetchSemestreAtual() {
            try {
                const response = await ConfiguracoesService.getSemestreAtual();
                setSemestreAtual(response); 
                setStartDate(parseISO(semestreAtual.dataAberturaPrazoPropostas))
                setEndDate(parseISO(semestreAtual.dataFechamentoPrazoPropostas))
            } catch (error) {
                console.error('Erro ao buscar o semestre atual:', error);
            }
        }

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
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 text-center text-gray-700'>Configurações do Sistema</h1>
                </div>
                <div className="card">
                    <TabView>
                        <TabPanel header="Prazo Envio de Propostas" leftIcon="pi pi-calendar mr-2" >
                            <div className="flex justify-between mb-5">
                                <div>
                                    <label>Data de Abertura do Prazo:</label>
                                    <Calendar
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.value)}
                                        dateFormat='dd/mm/yy'
                                        readOnlyInput
                                        showButtonBar
                                        locale='ptbr'
                                    />
                                </div>
                                <div>
                                    <label>Data de Fechamento do Prazo:</label>
                                    <Calendar
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.value)}
                                        dateFormat='dd/mm/yy'
                                        readOnlyInput
                                        showButtonBar
                                        locale='ptbr'
                                    />
                                </div>
                            </div>
                            <div className='text-right'>
                                <Button label="Salvar Alterações" severity="success" onClick={handleSaveDates} />
                            </div>
                        </TabPanel>
                        <TabPanel header="Coordenador de Curso" leftIcon="pi pi-user-edit mr-2" >
                            <div className="mb-5">
                                <AtualizarCoordenador />
                            </div>
                        </TabPanel>
                        <TabPanel header="Calendário" leftIcon="pi pi-calendar mr-2">
                            {semestreAtual && (
                                <div>
                                    <h2 className='heading-1 m-0 text-center text-gray-700'>Semestre Atual: {semestreAtual.periodo}</h2>
                                    <div className="flex justify-around mb-5 mt-5">
                                        <div>
                                            <label className='block'>Início:</label>
                                            <Calendar
                                                placeholder={semestreAtual.dataAberturaSemestre && format(parseISO(semestreAtual.dataAberturaSemestre), 'dd/MM/yyyy')}
                                                dateFormat='dd/mm/yy'
                                                locale='ptbr'
                                                disabled
                                            />
                                        </div>
                                        <div>
                                            <label className='block'>Final:</label>
                                            <Calendar
                                                placeholder={semestreAtual.dataFechamentoSemestre && format(parseISO(semestreAtual.dataFechamentoSemestre), 'dd/MM/yyyy')}
                                                dateFormat='dd/mm/yy'
                                                locale='ptbr'
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-around mb-5 mt-5">
                                        <div>
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
                                        <div>
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
                                    
                                    {semestreAtual.semestreCoordenador && (
                                        <div className="card">
                                        <Card title="Coordenador: ">
                                            <p className="m-0">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae 
                                                numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
                                            </p>
                                        </Card>
                                        <p>Coordenador: {semestreAtual.semestreCoordenador.coordenador_nome}</p>
                                            <p>Data de Alteração: {semestreAtual.semestreCoordenador.dataAlteracao && format(parseISO(semestreAtual.semestreCoordenador.dataAlteracao), 'dd/MM/yyyy')}</p>
                                    </div>
                                        
                                            
                                    )}
                                </div>
                            )}
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
};

ConfiguracoesPage.guards = [GUARDS.COORDENADOR];
ConfiguracoesPage.title = 'Configurações';

export default ConfiguracoesPage;
