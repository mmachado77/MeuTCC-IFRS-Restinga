import React, { useState, useEffect, use } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import ConfiguracoesService from 'meutcc/services/ConfiguracoesService';
import ProfessorService from 'meutcc/services/ProfessorService'; 
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
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ScrollPanel } from 'primereact/scrollpanel';

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});

const ConfiguracoesPage = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dataInicioNew, setDataInicioNew] = useState(new Date());
    const [dataFinalNew, setDataFinalNew] = useState(new Date());
    const [semestreAtual, setSemestreAtual] = useState(null);
    const [semestres, setSemestres] = useState([]);
    const [historicoCoordenadores, setHistoricoCoordenadores] = useState([]); // Estado para armazenar os dados recebidos
    const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do Dialog
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleDetalhes, setVisibleDetalhes] = useState(false);
    const [first, setFirst] = useState(0);
    const [semestreDetalhes, setSemestreDetalhes] = useState([]);
    const [semestreCoordenadores, setSemestreCoordenadores] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [professores, setProfessores] = useState([]);
    const [periodo, setPeriodo] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [rows, setRows] = useState(6); // Alterado para 6

    async function fetchSemestres(){
        try {
            const response = await ConfiguracoesService.getSemestres();
            const semestres = []
            semestres.push({
                id: 0
            })
            semestres.push(...response)
            setSemestres(semestres);
        }
        catch (error){
            console.error('Erro ao carregar semestres'. error);
        }
    }

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

    async function fetchSemestreDetalhes(id) {
        try {
            const response = await ConfiguracoesService.getSemestre(id);
            const response2 = await ConfiguracoesService.getCoordenadoresSemestre(id);
            setSemestreDetalhes(response);
            setSemestreCoordenadores(response2)
        } catch (error) {
            console.error('Erro ao buscar o semestre:', error);
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

    
    const openForm = () => {
        setVisibleForm(true);
    };

    const closeForm = () => {
        setVisibleForm(false);
    };


    async function atualizaCoordenadoresAposTroca(){
        fetchSemestreAtual()
        fetchHistoricoCoordenadores()
    }

    async function fetchProfessores() {
        try {
            const data = await ProfessorService.getProfessoresInternos(); // Chama a função que obtém os professores do serviço
            const professores2 = data.map((professor) => ({
                name: professor.nome,
                value: professor.id
            }));
            setProfessores(professores2); // Define os dados dos professores no estado local
        } catch (error) {
            console.error('Erro ao buscar professores', error);
        }
    }

    useEffect(() => {
        fetchProfessores();
        fetchSemestres();
        fetchSemestreAtual();
        fetchHistoricoCoordenadores();
    }, []);

    const totalSemestres = semestres.length;
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    
    const handlePeriodoChange = (e) => {
        // Remove espaços
        const value = e.target.value.replace(/\s/g, '');
        // Remove caracteres não numéricos e não "/"
        const newValue = value.replace(/[^0-9/]/g, '');
        // Define o novo valor no estado
        setPeriodo(newValue);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataInicio = format(dataInicioNew, 'yyyy-MM-dd')
        const dataFinal = format(dataFinalNew, 'yyyy-MM-dd')

        const dados = {
            semestre: {
                periodo: periodo,
                dataAberturaSemestre: dataInicio,
                dataFechamentoSemestre: dataFinal,
                configuracoes: 1
            },
            coordenador_id: selectedProfessor 
        };

        criarSemestre(dados);
    };

    const criarSemestre = async (dados) => {
        const data = await toast.promise(ConfiguracoesService.criarSemestre(dados), {
            loading: 'Criando Semestre...',
            success: 'Semestre Criado com Sucesso!',
            error: 'Erro ao Criar',
        })
        fetchSemestres()
        setVisibleForm(false)
    }
    
    const renderSemestres = () => {
        const semestresPaginados = semestres.slice(first, first + rows);
        return semestresPaginados.map((semestre, index) => (
            semestre.id==0?
            <div key={index} className=' flex justify-center items-center py-2 text-gray-700 shadow-md shadow-gray-300 border border-solid border-gray-200 rounded-lg text-center'>
            <Button
            className='font-bold'
            icon={isHovered ? '':'pi pi-plus'}
            iconPos='right'
            rounded 
            size='large' 
            severity="secondary" 
            label={isHovered ? "" : ""}
            outlined={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setVisibleForm(true)}
        >
                 {isHovered ? "Novo Semestre" : ""}
            </Button>
            <Dialog header="Criar Semestre" visible={visibleForm} onHide={() => setVisibleForm(false)} style={{ width: '50vw' }}>
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid font-bold">
                    <div className="p-field my-2">
                        <label htmlFor="periodo">Período:</label>
                        <InputText id="periodo" value={periodo} placeholder='Ex: 2024/2' onChange={handlePeriodoChange}/>
                    </div>
                    <div className="p-field my-2">
                    <label htmlFor="coordenador">Coordenador:</label>
                        <Dropdown 
                            inputId="dd-professor" 
                            value={selectedProfessor} 
                            onChange={(e) => setSelectedProfessor(e.value)} 
                            options={professores} 
                            placeholder="Selecione o novo Coordenador"
                            optionLabel="name" 
                            className="w-full"
                        />
                    </div>
                    <div className='flex justify-between items-end'>
                        <div className="p-field my-2">
                            <label htmlFor="dataAberturaSemestre">Início do Semestre:</label>
                            <Calendar id="criaDataAberturaSemestre"
                            value={dataInicioNew}
                            onChange={(e) => setDataInicioNew(e.value)}
                            dateFormat='dd/mm/yy'
                            className='max-w-48'
                            showButtonBar
                            locale='ptbr'
                            showIcon />
                        </div>
                        <div className="p-field my-2">
                            <label htmlFor="dataFechamentoSemestre">Final do Semestre:</label>
                            <Calendar id="criaDataFechamentoSemestre"
                            value={dataFinalNew}
                            onChange={(e) => setDataFinalNew(e.value)}
                            dateFormat='dd/mm/yy'
                            className='max-w-48'
                            showButtonBar
                            locale='ptbr'
                            showIcon />
                        </div>
                    </div>
                    <div className='w-full my-2 mt-2 border-0 border-t border-dashed border-gray-200'></div>
                    <div>
                        <Button type='submit' label='Criar Semestre' className='mt-2' severity='success'></Button>
                    </div>
                    </div>
                </form>
            </Dialog>
            <Dialog className='max-w-fit' header={"Detalhes do Semestre " + semestreDetalhes.periodo} visible={visibleDetalhes} onHide={() => setVisibleDetalhes(false)}>
            <div className='flex justify-evenly'>
                <div className='content-center'>
                    <div className=''>
                    <label htmlFor="coordenador" className="font-bold text-gray-700 text-lg">{"Coordenador: "}</label>
                    <label htmlFor="coordenador" className="font-bold text-gray-700 text-lg">{semestreDetalhes.coordenador} </label>
                    </div>
                    <div className='mt-5'>
                    {/* <span className='block text-gray-700 text-sm'>Data de Alteração:</span>
                    <span className='text-gray-700 text-sm'>{semestreAtual.semestreCoordenador.dataAlteracao && format(parseISO(semestreAtual.semestreCoordenador.dataAlteracao), 'dd/MM/yyyy')}</span> */}
                    </div>
                    <div>
                        <label htmlFor="inicio" className="block font-bold text-gray-700">Início: </label>
                        <span className='text-gray-700'>{semestreDetalhes.dataAberturaSemestre && format(parseISO(semestreDetalhes.dataAberturaSemestre), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className='py-3 border-0 border-r border-dashed border-gray-200 mr-12 ml-12'></div>
                    <div>
                        <label htmlFor="final" className="block font-bold text-gray-700">Final: </label>
                        <span className='text-gray-700'>{semestreDetalhes.dataFechamentoSemestre && format(parseISO(semestreDetalhes.dataFechamentoSemestre), 'dd/MM/yyyy')}</span>
                    </div>
                </div>
                <ScrollPanel style={{ height: '200px' }}>
                {/* <label htmlFor="coordenador" className="font-bold text-gray-700 text-lg ">Histórico de Coordenadores: </label> */}
                    <Timeline
                        className='content-center'
                        value={semestreCoordenadores}
                        opposite={(item) => item.coordenador_nome}
                        content={(item) => <small className="text-color-secondary">{format(parseISO(item.dataAlteracao), 'dd/MM/yyyy')}</small>}
                    />
                </ScrollPanel>
                
                

            </div>
            </Dialog>
            </div>:
            <div key={index} className='hover:border-green-500 cursor-pointer py-2 text-gray-700 shadow-md shadow-gray-300 border border-solid border-gray-200 rounded-lg text-center' onClick={ () => {fetchSemestreDetalhes(semestre.id), setVisibleDetalhes(true)}}>
                <h2 className='m-0'>{semestre.periodo}</h2>
                <div className='w-full my-2 mt-2 border-0 border-t border-dashed border-gray-200'></div>
                <h4 className='m-0 mx-5'>Coordenador:</h4>
                <h4 className='m-0 mx-5 font-light'>{semestre.coordenador || 'Sem Coordenador'}</h4>
                <div className='w-full my-2 mt-2 border-0 border-t border-dashed border-gray-200'></div>                                                 
                <h4 className='my-2 mx-5'>Início: {format(parseISO(semestre.dataAberturaSemestre), 'dd/MM/yyyy')}</h4>
                <h4 className='my-2 mx-5'>Fim: {format(parseISO(semestre.dataFechamentoSemestre), 'dd/MM/yyyy')}</h4>
            </div>
        ));
    };


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
                                            <div className='grid grid-cols-3 gap-4'>
                                            {renderSemestres()}
                                            </div>
                                            <Paginator first={first} rows={rows} totalRecords={totalSemestres} rowsPerPageOptions={[3, 6, 12, 18]} onPageChange={onPageChange} /> 
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