import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link';
import ConfiguracoesService from 'meutcc/services/ConfiguracoesService';
import { format } from 'date-fns';
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import toast from 'react-hot-toast';
import { GUARDS } from 'meutcc/core/constants';
import AtualizarCoordenador from 'meutcc/pages/painel-configuracoes/selecionar-coordenador'

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});



const ConfiguracoesPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    
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
                                        locale='ptbr'
                                        readOnlyInput
                                        showButtonBar
                                    />
                                </div>
                                <div>
                                    <label>Data de Fechamento do Prazo:</label>
                                    <Calendar
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.value)}
                                        dateFormat='dd/mm/yy'
                                        locale='ptbr'
                                        readOnlyInput
                                        showButtonBar
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
                </TabView>
            </div>


                
            </div>
        </div>
    );
};

ConfiguracoesPage.guards = [GUARDS.COORDENADOR];

export default ConfiguracoesPage;