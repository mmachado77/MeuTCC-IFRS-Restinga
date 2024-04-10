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
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import { Message } from 'primereact/message';

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});

const ConfiguracoesPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [semestreAtual, setSemestreAtual] = useState(null);
    const [historicoCoordenadores, setHistoricoCoordenadores] = useState([]); // Estado para armazenar os dados recebidos
    const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do Dialog

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

    async function fetchHistoricoCoordenadores() { // Função para buscar o histórico de coordenadores
        try {
            const historico = await ConfiguracoesService.getHistoricoCoordenadores(); // Chame a função getHistoricoCoordenadores
            setHistoricoCoordenadores(historico);
        } catch (error) {
            console.error('Erro ao buscar o histórico de coordenadores:', error);
        }
    }

    async function atualizaCoordenadoresAposTroca(){
        fetchSemestreAtual()
        fetchHistoricoCoordenadores()
    }

    useEffect(() => {
        fetchSemestreAtual();
        fetchHistoricoCoordenadores();
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
        fetchSemestreAtual()
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
                                            <Card className='shadow-md shadow-gray-300 border border-solid border-gray-200 rounded-lg text-gray-700' title="Coordenador Atual">
                                                <div className='flex justify-between items-center'>
                                                    <div className='flex items-start items-center'>
                                                        <div className="p-avatar p-component p-avatar-image p-avatar-circle ml-3" style={{height: "80px", width: "80px"}} >
                                                            <img alt="avatar" className="hover:brightness-90" height="80" width="80" src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" data-pc-section="image" element-id="348" />
                                                        </div>
                                                        <div className='ml-5'>
                                                            <div className=''>
                                                            <label htmlFor="coordenador" className="font-bold text-gray-700 text-lg">{semestreAtual.semestreCoordenador.coordenador_nome} </label>
                                                            </div>
                                                            <div className='block'>
                                                            <span className='text-gray-700 text-sm'>Data de Alteração: {semestreAtual.semestreCoordenador.dataAlteracao && format(parseISO(semestreAtual.semestreCoordenador.dataAlteracao), 'dd/MM/yyyy')}</span>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div>
                                                    <Button label="Ver Histórico" severity="warning" className="" icon='pi pi-history' iconPos='right' outlined onClick={() => setVisible(true)} />
                                                    <Dialog header="Histórico de Alterações" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                                                        <Timeline
                                                            value={historicoCoordenadores}
                                                            opposite={(item) => item.coordenador_nome}
                                                            content={(item) => <small className="text-color-secondary">{format(parseISO(item.dataAlteracao), 'dd/MM/yyyy')}</small>}
                                                            
                                                        />
                                                    </Dialog>
                                                    </div>
                                                    </div>
                                                    </Card>
                                                    <Fieldset legend='Alterar Coordenador' collapsed toggleable   className='text-gray-700 shadow-md shadow-gray-300 border border-solid border-gray-200 rounded-lg mt-5 p-3'>
                                                    <AtualizarCoordenador onPosAlterar={atualizaCoordenadoresAposTroca}/>
                                                    </Fieldset>
                                                </div>
                                            </TabPanel>
                                            <TabPanel header="Prazo Envio de Propostas" leftIcon="pi pi-calendar mr-2" >
                                            <Card title='Prazo para Submissão de Propostas' className='text-gray-700 shadow-md shadow-gray-300 border border-solid border-gray-200 rounded-lg'>
                                                
                                                {semestreAtual.statusPrazo && 
                                                <Message severity="info" text="O sistema está aceitando propostas para o Semestre Atual." className="border-primary w-full justify-center p-6 pl-3" />
                                                ||
                                                <Message severity="warn" text="O sistema não está aceitando propostas para o Semestre Atual." className="border-primary w-full justify-center p-6 pl-3" />
                                                }
                                                
                                                <div className='flex justify-evenly pt-9'>
                                                    <div className='pb-3 text-center'>
                                                    <label htmlFor="inicioPrazo" className="block font-bold text-gray-700">Abertura do Prazo: </label>
                                                    <Calendar
                                                        value={parseISO(semestreAtual.dataAberturaPrazoPropostas)}
                                                        dateFormat='dd/mm/yy'
                                                        disabled
                                                        inputClassName='text-2xl text-center'
                                                        className='max-w-40'
                                                        locale='ptbr'
                                                    />
                                                    </div>
                                                    <div className='py-3 border-0 border-r-2 border-dashed border-gray-200 mr-12 ml-12'></div>
                                                    <div className='text-center'>
                                                    <label htmlFor="finalPrazo" className="block font-bold text-gray-700">Fechamento do Prazo: </label>
                                                    <Calendar
                                                        value={parseISO(semestreAtual.dataFechamentoPrazoPropostas)}
                                                        dateFormat='dd/mm/yy'
                                                        disabled
                                                        inputClassName='text-2xl text-center'
                                                        className='max-w-40 '
                                                        locale='ptbr'
                                                    />
                                                    </div>
                                                </div>
                                                
                                                
                                            
                                            </Card>
                                            <Fieldset legend='Alterar Prazo para Submissão de Propostas' collapsed toggleable   className='text-gray-700 shadow-md shadow-gray-300 border border-solid border-gray-200 rounded-lg mt-5 p-3'>
                                            <div className="mb-5">
                                                <div className='flex justify-around'>
                                                <div className='mb-5'>
                                                    <div className=''>
                                                    <label className='block'>Data de Abertura do Prazo:</label>
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
                                                    <label className='block'>Data de Fechamento do Prazo:</label>
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
                                            </div>
                                            <div className=''>
                                                    <Button label="Salvar Alterações" severity="success" className='w-full' onClick={handleSaveDates} />
                                            </div>
                                            </Fieldset>
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
