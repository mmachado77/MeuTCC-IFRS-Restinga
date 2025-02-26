import React, { useState, useEffect, use } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import ConfiguracoesService from 'meutcc/services/ConfiguracoesService';
import ProfessorService from 'meutcc/services/ProfessorService';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { GUARDS } from 'meutcc/core/constants';
import { Card } from 'primereact/card';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

const Semestre = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dataInicioNew, setDataInicioNew] = useState(new Date());
    const [dataFinalNew, setDataFinalNew] = useState(new Date());
    const [semestreAtual, setSemestreAtual] = useState([]);
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
    const router = useRouter();

    async function fetchSemestres() {
        try {
          const response = await ConfiguracoesService.getSemestres();
          setSemestres(response);
          handleApiResponse(response);
        } catch (error) {
          handleApiResponse(error.response);
          console.error('Erro ao carregar semestres'.error);
        }
    }

    const handlePeriodoChange = (e) => {
        // Remove espaços
        const value = e.target.value.replace(/\s/g, '');
        // Remove caracteres não numéricos e não "/"
        const newValue = value.replace(/[^0-9/]/g, '');
        // Define o novo valor no estado
        setPeriodo(newValue);
    };

    async function fetchSemestreAtual() {
        try {
          const response = await ConfiguracoesService.getSemestreAtual();
          setSemestreAtual(response);
      
            setStartDate(parseISO(response.dataAberturaSemestre))
            setEndDate(parseISO(response.dataFechamentoSemestre))
      
          handleApiResponse(response);
        } catch (error) {
          setSemestreAtual(null);
          handleApiResponse(error.response);
          console.error('Erro ao buscar o semestre atual:', error);
        }
      }
      

    useEffect(() => {
        fetchSemestres();
        fetchSemestreAtual();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        const dataInicio = format(dataInicioNew, 'yyyy-MM-dd')
        const dataFinal = format(dataFinalNew, 'yyyy-MM-dd')

        const dados = {
            semestre: {
                periodo: periodo,
                dataAberturaSemestre: dataInicio,
                dataFechamentoSemestre: dataFinal
            },
        };

        criarSemestre(dados);

    };

    const criarSemestre = async (dados) => {
        try {
            const data = await toast.promise(ConfiguracoesService.criarSemestre(dados), {
                loading: 'Criando Semestre...',
                success: 'Semestre Criado com Sucesso!',
                error: 'Erro ao Criar',
            })
            await fetchSemestres()
            await fetchSemestreAtual()
            setVisibleForm(false)
            handleApiResponse(response);
        } catch (e) {
            handleApiResponse(error.response);
            console.error(e);
        }

    }



    const header = (
            <div className="flex justify-between items-center px-6 pt-6">
                <div>
                <h1 className="text-2xl font-bold">Gerenciamento de Semestres</h1>
                </div>
                <Button
                    label="Voltar ao Dashboard"
                    icon="pi pi-arrow-left"
                    className="p-button-secondary"
                    onClick={() => router.push('dashboard')}
                />
            </div>
            
        );

        const renderHeaderTable = () => (
                <div className="text-center">
                    <h1>Semestres Anteriores</h1>
                </div>
            );

    return (
        <div className='p-4 max-w-screen-lg mx-auto '>
            <Card
            header={header}
            >
                <div className='flex justify-between'>
            {semestreAtual ? (
            <div className='p-4 w-[48%] flex-col text-gray-700 border border-gray-200 border-solid rounded-lg shadow-md  shadow-gray-300'>
                <h1 className='mb-2 text-center text-gray-700'>{`Semestre Atual: ${semestreAtual.periodo}`}</h1>
                <div className='flex justify-around'>
                    <div>
                        <label htmlFor="inicio" className="font-bold text-gray-700">Início: </label>
                        <span className='text-gray-700'>{semestreAtual.dataAberturaSemestre && format(parseISO(semestreAtual.dataAberturaSemestre), 'dd/MM/yyyy')}</span>
                    </div>
                    <div>
                        <label htmlFor="final" className="font-bold text-gray-700">Final: </label>
                        <span className='text-gray-700'>{semestreAtual.dataFechamentoSemestre && format(parseISO(semestreAtual.dataFechamentoSemestre), 'dd/MM/yyyy')}</span>
                    </div>
                </div>

                <div className="card flex justify-content-center mt-2">
                    <Calendar value={new Date().toLocaleDateString()} disabled onChange={(e) => setDate(e.value)} inline locale="ptbr"/>
                </div>
            </div>
            ) : (
                    <div className='flex justify-center items-center'>
                    <Button label="Criar Novo Semestre" icon='pi pi-plus' className='w-full mt-5' severity="success" onClick={() => setVisibleForm(true)} />
                                                        
                    </div>
            )}
            <Dialog header="Criar Semestre" visible={visibleForm} onHide={() => setVisibleForm(false)} style={{ width: '50vw' }}>
                <form onSubmit={handleSubmit}>
                    <div className="font-bold p-fluid">
                        <div className="my-2 p-field">
                            <label htmlFor="periodo">Período:</label>
                            <InputText id="periodo" value={periodo} placeholder='Ex: 2024/2' onChange={handlePeriodoChange} />
                        </div>
                        <div className='flex items-end justify-between'>
                            <div className="my-2 p-field">
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
                            <div className="my-2 p-field">
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
                        <div className='w-full my-2 mt-2 border-0 border-t border-gray-200 border-dashed'></div>
                        <div>
                            <Button type='submit' label='Criar Semestre' className='mt-2' severity='success'></Button>
                        </div>
                    </div>
                </form>
            </Dialog>
            <div className='w-[48%] '>
            <DataTable
                dataKey="periodo"
                value={semestres}
                stripedRows
                paginator
                rows={5}
                header={renderHeaderTable}
                rowsPerPageOptions={[5, 10, 20]}
                emptyMessage="Nenhum Semestre Anterior">
                <Column header="Período" field="periodo" />
                <Column
                header="Início"
                body={(rowData) =>
                    rowData.dataAberturaSemestre
                    ? format(parseISO(rowData.dataAberturaSemestre), 'dd/MM/yyyy')
                    : ''
                }
                />

                <Column
                header="Fim"
                body={(rowData) =>
                    rowData.dataFechamentoSemestre
                    ? format(parseISO(rowData.dataFechamentoSemestre), 'dd/MM/yyyy')
                    : ''
                }
                />
                            </DataTable>
                            </div>
                            </div>
                            {semestreAtual !=null &&
                            <div className='flex justify-center items-center'>
                            <Button label="Criar Novo Semestre" icon='pi pi-plus' className='w-full mt-5' severity="success" onClick={() => setVisibleForm(true)} />
                                                                
                            </div>
                            }
                            </Card>
                        </div>
                    );
                };

Semestre.guards = [GUARDS.SUPERADMIN];
Semestre.title = 'Semestre';

export default Semestre;