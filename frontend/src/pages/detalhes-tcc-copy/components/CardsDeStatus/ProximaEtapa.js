import React, { useState } from 'react';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { Tooltip } from 'primereact/tooltip';

const renderMessageContent = (instrucoes, primaryColor, icon) => {
    return (
        <div className="flex flex-col text-center items-center justify-between py-3">
            <div className=''>
                <i className={`${icon}`} style={{ color: primaryColor, fontSize: '1.7rem' }}></i>
            </div>
            <div className=''>
                <span className='text-[1.2rem]'>{instrucoes}</span>
            </div>
        </div>
    );
};

const renderButtonCTA = (isPreviaChecked, cta) => {
    if (isPreviaChecked) {
        return (
            <Button
                pt={{
                    label: {
                    style: { flex: 'none' }
                    }
                }}
                className='w-full flex justify-center text-[1rem]'
                icon='pi pi-calendar'
                label='Agendar Sessão de Andamento'
                severity='warning'
            />
        );
    } else {
        return (
            <Button
                pt={{
                    label: {
                    style: { flex: 'none' }
                    }
                }}
                className='w-full flex justify-center text-[1rem]'
                icon='pi pi-calendar'
                label={cta?.valor}
                severity='warning'
            />
        );
    }
};

const renderMessage = (instrucoes, previa, corFundo, primaryColor, icon, isPreviaChecked, cta, onToggle) => {
    const renderTooltip = () => {
        return (
            <div className='flex flex-col gap-1'>
                <span className='block'>O seu curso não exige a apresentação do TCC em uma Sessão Pública de Andamento.</span>
                <span className='block'>Entretanto, pode ser uma boa oportunidade para colher feedback sobre o desenvolvimento do seu trabalho.</span>
                <span className='block'>Marque essa opção para agendar sua Sessão Pública de Andamento.</span>
            </div>
        )
    }
    return (
        <div className="card">
            <div>
                <Message
                    style={{
                        backgroundColor: `${corFundo}`,
                        color: `${primaryColor}`,
                        padding: "0.5rem",
                    }}
                    className="w-full justify-content-start"
                    severity="success"
                    content={renderMessageContent(instrucoes, primaryColor, icon)}
                />
            </div>

            {/* Renderização condicional da “prévia”: substituído o <span>previa opcional?</span> pelo InputSwitch */}
            {previa && (
                <div className='flex flex-col gap-3 py-4'>
                    <div className="px-2 py-3 flex justify-between items-center text-[0.9rem] text-gray-600 border border-solid border-gray-300 rounded-md"
                    // style={{ color: primaryColor }}
                    >
                        <div className='w-2/4 p-1'>
                            {/* Label */}
                            <label htmlFor="publicaSwitch" className="font-medium">
                                <span className='block'>Sessão Pública</span>
                                <span>de Andamento</span>
                                <i
                                    className="pi pi-question-circle p-1"
                                    data-pr-position="top"
                                    style={{ cursor: 'pointer', fontSize: "0.9rem" }}
                                />
                            </label>
                            {/* Ícone com Tooltip */}
                            <Tooltip
                                pt={{
                                    text: {
                                    style: { backgroundColor: primaryColor,
                                        color: 'text-gray-700'
                                     }
                                    }
                                }}
                                target=".pi-question-circle"
                                className='max-w-[320px] text-[0.85rem]'>
                                {renderTooltip()}
                            </Tooltip>
                        </div>

                        {/* InputSwitch */}
                        <InputSwitch
                            className='mr-2'
                            id="publicaSwitch"
                            checked={isPreviaChecked}
                            onChange={(e) => onToggle(e.value)}
                        />
                    </div>

                    <div>
                        {cta &&(
                            renderButtonCTA(isPreviaChecked, cta)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ProximaEtapa = ({ props }) => {
    const primaryColor = "#f97316";
    const messageColor = "#fff2e2b3";
    const icon = "pi pi-exclamation-circle";

    // 1) Criar estado para isPreviaChecked
    const [isPreviaChecked, setIsPreviaChecked] = useState(false);

    // 2) Criar estado para armazenar instrucoes (valor inicial via props)
    const [instrucoesState, setInstrucoesState] = useState(props?.instrucoes);

    // Função que será chamada ao togglar o InputSwitch
    const handleTogglePrevia = (checked) => {
        setIsPreviaChecked(checked);

        // 3) Se marcado, troca instrucoesState para a mensagem específica
        //    Se desmarcado, volta para instruções originais via props
        if (checked) {
            setInstrucoesState("Você já pode agendar sua Sessão Pública de Andamento.");
        } else {
            setInstrucoesState(props?.instrucoes);
        }
    };

    return (
        <div
            className={`card flex flex-col px-4 mt-10 border border-dashed rounded-md shadow-md`}
            style={{ borderColor: primaryColor }}
        >
            {/* Cabeçalho: Próximos passos */}
            <div>
                <div className='text-start -mt-[0.85rem]'>
                    <Tag
                        className='h-fit text-[1rem] font-semibold'
                        value="Próximos passos"
                        style={{ backgroundColor: `${primaryColor}`, color: '#FFFFFF' }}
                    />
                </div>
                <div className="flex items-center justify-between mt-2 mb-3">
                    {/* Chamando renderMessage com instrucoesState e isPreviaChecked */}
                    {renderMessage(
                        instrucoesState,
                        props?.previaOpcional,   // continua respeitando a lógica anterior de exibir ou não a seção
                        messageColor,
                        primaryColor,
                        icon,
                        isPreviaChecked,
                        props?.cta,
                        handleTogglePrevia
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProximaEtapa;
