import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import CardSessaoForm from './CardSessaoForm'
// Importe seu serviço e contexto conforme a sua estrutura de projeto
import ProfessoresAvaliadores from '../services/ProfessoresAvaliadores';
import { useTccContext } from '../context/TccContext';
import CustomAvatar from '../../../components/ui/CustomAvatar'; // Exemplo do seu componente de avatar
import { SelectButton } from 'primereact/selectbutton';
import { InputTextarea } from 'primereact/inputtextarea';

const optionsLocalSessao = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'Conferência', value: 'conferencia' },
];


// Template para exibir avaliadores com avatar e nome
const professorOptionTemplate = (option) => {
    // Se estiver vazio, apenas retorna sem exibir avatar
    if (!option?.nome) {
        return null;
    }

    return (
        <div className="flex items-center">
            <CustomAvatar
                className="w-[40px] h-[40px] text-[20px]"
                image={option.avatar}
                fullname={option.nome}
                size="large"
                shape="circle"
            />
            <span className="ml-3">{option.nome}</span>
        </div>
    );
};

const FormSessaoDialog = ({ tipoSessao, open, onClose }) => {
    const { tccData } = useTccContext();

    const [formData, setFormData] = useState({
        idTCC: tccData?.id || '',
        tipo: tipoSessao,
        avaliador1: null,
        avaliador2: null,
        dataInicio: null, // Data e hora
        localForma: 'presencial',
        localDescricao: '',
    });

    const [errors, setErrors] = useState({});
    const [professoresAptos, setProfessoresAptos] = useState([]);

    // Busca lista de professores aptos
    useEffect(() => {
        {
            ProfessoresAvaliadores.getProfessoresByCurso()
                .then((data) => {
                    const filtered = tccData?.orientador
                        ? data.filter((prof) => prof.id !== tccData.orientador.id)
                        : data;
                    setProfessoresAptos(filtered);
                })
                .catch((error) => {
                    console.error('Erro ao buscar professores aptos:', error);
                });
        }
    }, [tccData]);

    // Evitar que avaliador2 seja o mesmo que avaliador1
    const professoresAptosParaAvaliador2 = formData.avaliador1
        ? professoresAptos.filter((prof) => prof.id !== formData.avaliador1.id)
        : professoresAptos;

    // Validações mínimas
    const validateForm = () => {
        const newErrors = {};
        if (!formData.avaliador1) newErrors.avaliador1 = 'Selecione o avaliador 1';
        if (!formData.avaliador2) newErrors.avaliador2 = 'Selecione o avaliador 2';
        if (!formData.dataInicio) newErrors.dataInicio = 'A data é obrigatória';
        if (!formData.localForma) newErrors.localForma = 'Selecione a forma do local';
        if (!formData.localDescricao || formData.localDescricao.trim() === '') {
            newErrors.localDescricao = 'Informe a descrição do local';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // Submeter ...
        console.log('Enviando dados:', formData);
        onClose();
    };

    return (
        <Dialog
            header={tipoSessao === 'ANDAMENTO' ? 'Agendar Sessão de Andamento' : 'Agendar Sessão Final'}
            visible={open}
            style={{ width: '1020px' }}
            onHide={onClose}
        >
            <div className="flex gap-4">
                {/* Coluna Esquerda: Calendar inline + Calendar (timeOnly) */}
                <div className="w-auto flex flex-col gap-5">
                    <div className="w-full">
                        <Calendar
                            className='w-full'
                            inputId="dataSessaoInline"
                            dateFormat="dd/mm/yy"
                            locale="ptbr"
                            value={formData.dataInicio}
                            onChange={(e) =>
                                setFormData({ ...formData, dataInicio: e.value })
                            }
                        />
                        {errors.dataInicio && (
                            <small className="text-red-500">{errors.dataInicio}</small>
                        )}
                    </div>


                </div>

                {/* Coluna Direita: Avaliadores, Local, Botões, Card de prévia */}
                <div className="w-2/4 flex flex-col gap-4">
                    <form onSubmit={handleSubmit} className=" h-full flex flex-col py-6 justify-between">
                        <div className='flex justify-between gap-3'>
                            <div className='w-2/5 flex flex-col'>
                                {/* relógio */}
                                <span>Horário</span>
                                <Calendar
                                    inputClassName='text-center text-2xl font-semibold text-gray-600 p-0'
                                    inputId="horaSessao"
                                    value={formData.dataInicio}
                                    onChange={(e) =>
                                        setFormData({ ...formData, dataInicio: e.value })
                                    }
                                    placeholder=''
                                    timeOnly
                                    inline
                                    stepMinute={10}
                                    stepHour={1}
                                    hourFormat="24"
                                    locale="ptbr"
                                    pt={{
                                        input: {
                                            style: {
                                                margin: 'auto'
                                            },
                                        }
                                    }}
                                />
                            </div>

                            <div className='w-full flex flex-col gap-2 h-full'>
                                <div className='flex justify-end'>
                                    <SelectButton
                                        required
                                        pt={{
                                            label: {
                                                style: { flex: 'none' },
                                            },
                                            button: {
                                                className: 'py-1'
                                            }
                                        }}
                                        className=""
                                        value={formData.localForma}
                                        options={optionsLocalSessao}
                                        onChange={(e) => setFormData({ ...formData, localForma: e.value })}
                                    />
                                </div>
                                <div className='h-[80%]'>
                                    {/* Descrição do Local */}
                                    <FloatLabel
                                        className='h-full'>
                                        <InputTextarea
                                            className='h-full w-full'
                                            id="localDescricao"
                                            autoResize={false}
                                            value={formData.localDescricao}
                                            onChange={(e) =>
                                                setFormData({ ...formData, localDescricao: e.target.value })
                                            }
                                        />
                                        <label htmlFor="localDescricao">Descrição do Local</label>
                                    </FloatLabel>
                                </div>

                            </div>
                        </div>
                        {/* Avaliador 1 */}
                        <FloatLabel>
                            <Dropdown
                                id="avaliador1"
                                value={formData.avaliador1}
                                options={professoresAptos}
                                optionLabel="nome"
                                placeholder=" " // Importante para FloatLabel
                                itemTemplate={professorOptionTemplate}
                                valueTemplate={professorOptionTemplate}
                                onChange={(e) =>
                                    setFormData({ ...formData, avaliador1: e.value })
                                }
                            />
                            <label htmlFor="avaliador1">Avaliador 1</label>
                        </FloatLabel>
                        {errors.avaliador1 && (
                            <small className="text-red-500">{errors.avaliador1}</small>
                        )}

                        {/* Avaliador 2 */}
                        <FloatLabel>
                            <Dropdown
                                className='w-full min-h-[75px]'
                                id="avaliador2"
                                value={formData.avaliador2}
                                options={professoresAptosParaAvaliador2}
                                optionLabel="nome"
                                placeholder=" "
                                itemTemplate={professorOptionTemplate}
                                valueTemplate={professorOptionTemplate}
                                onChange={(e) =>
                                    setFormData({ ...formData, avaliador2: e.value })
                                }
                            />
                            <label htmlFor="avaliador2">Avaliador 2</label>
                        </FloatLabel>
                        {errors.avaliador2 && (
                            <small className="text-red-500">{errors.avaliador2}</small>
                        )}
                        {errors.localDescricao && (
                            <small className="text-red-500">{errors.localDescricao}</small>
                        )}
                    </form>
                </div>
            </div>
            <div className="w-full mt-12 flex justify-between">

                {/* Botões */}
                <div className="flex justify-end gap-2">
                    <Button
                        label="Cancelar"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={onClose}
                        type="button"
                    />
                    <Button
                        label="Confirmar"
                        icon="pi pi-check"
                        type="submit"
                    />
                </div>
            </div>
            {/* Card de prévia componentizado */}
            <CardSessaoForm formData={formData} />
        </Dialog>
    );
};

export default FormSessaoDialog;
