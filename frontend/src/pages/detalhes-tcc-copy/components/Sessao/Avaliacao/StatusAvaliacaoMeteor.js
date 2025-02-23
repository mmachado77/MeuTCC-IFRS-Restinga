import { useEffect } from 'react';
import { MeterGroup } from 'primereact/metergroup';
import { useTccContext } from '../../../context/TccContext';
import { Tag } from 'primereact/tag';

// Componente para injetar os estilos da animação no metercontainer
const StyleInjector = () => {
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Garante que o container seja relativo e que o pseudo-elemento seja exibido dentro dele */
            .p-metergroup-meter-container {
                position: relative;
                overflow: hidden;
            }
            /* Pseudo-elemento que cria o overlay animado */
            .p-metergroup-meter-container::after {
                content: "";
                position: absolute;
                inset: 0;
                pointer-events: none;
                background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0));
                animation: slideOverlay 1.8s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
            }
            @keyframes slideOverlay {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    return null;
};

const StatusAvaliacaoMeteor = ({ sessaoFinal }) => {
    const { tccData } = useTccContext();
    const orientador = tccData?.orientador;
    const professores = sessaoFinal?.banca?.professores || [];
    const avaliacao = sessaoFinal?.avaliacao || {};

    const getShortName = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.split(" ");
        let sobrenome = parts[parts.length - 1];
        // if (parts[0].concat(" ", sobrenome).length > 11) {
        //     sobrenome = sobrenome.slice(0, 1) + ".";
        // }
        if (parts.length === 1) return parts[0];
        return `${parts[0]} ${sobrenome}`;
    };


    // Definição das cores
    const colorOrientador = '#3b82f6';
    const colorAvaliador1 = '#22c55e';
    const colorAvaliador2 = '#facc15';
    const corVazia = '#e5e7eb';

    // Monta os itens
    const items = [
        {
            label: `${orientador?.nome || 'Orientador'}`,
            color: avaliacao.avaliado_orientador ? colorOrientador : corVazia,
            colorOriginal: colorOrientador,
            role: "Orientador",
            colorTexto: colorOrientador,
            value: 40,
            icon: 'pi pi-user',
            evaluated: avaliacao.avaliado_orientador
        },
        {
            label: `${professores[0]?.nome || 'Avaliador 1'}`,
            color: avaliacao.avaliado_avaliador1 ? colorAvaliador1 : corVazia,
            colorOriginal: colorAvaliador1,
            role: "Avaliador(a)",
            colorTexto: colorAvaliador1,
            value: 30,
            icon: 'pi pi-user',
            evaluated: avaliacao.avaliado_avaliador1
        },
        {
            label: `${professores[1]?.nome || 'Avaliador 2'}`,
            color: avaliacao.avaliado_avaliador2 ? colorAvaliador2 : corVazia,
            colorOriginal: colorAvaliador2,
            role: "Avaliador(a)",
            colorTexto: colorAvaliador2,
            value: 30,
            icon: 'pi pi-user',
            evaluated: avaliacao.avaliado_avaliador2
        }
    ];

    // Cria a cópia ordenada com um id único para cada item
    const sortedItems = [...items]
        .sort((a, b) => {
            // Primeiro: avaliados (true) vêm antes dos não avaliados
            if (a.evaluated !== b.evaluated) {
                return a.evaluated ? -1 : 1;
            }
            // Segundo: dentro do mesmo grupo, "Orientador" vem antes de "Avaliador(a)"
            if (a.role === b.role) {
                return 0;
            }
            return a.role === 'Orientador' ? 1 : -1;
        })
        .map((item, index) => ({ ...item, id: `${item.role}-${index}` }));

    const getProgress = () =>{
        let progress = 0;
        items.forEach((item) => {
            if (item.evaluated) progress += item.value;
        });
        return progress
    }


    const meterTemplate = (props, attr = {}) => {
        const borderStyle = {
            borderTopLeftRadius: props.index === 0 ? '0.5rem' : 0,
            borderBottomLeftRadius: props.index === 0 ? '0.5rem' : 0,
            borderTopRightRadius: props.index === 2 ? '0.5rem' : 0,
            borderBottomRightRadius: props.index === 2 ? '0.5rem' : 0,
        };

        return (
            <span
                {...attr}
                key={props.id}
                className="relative inline-block overflow-hidden"
                style={{
                    height: '0.75rem',
                    backgroundColor: props.color,
                    width: `${props.value}%`,
                    ...borderStyle
                }}
            />
        );
    };


    // Render customizado para a labelList (sem alterações)
    const customLabelList = ({ values }) => {
        let cumulative = 0;
        return (
            <div className="relative flex mt-2" style={{ minHeight: 'fit-content', width: '100%' }}>
                {values.map((item, index) => {
                    const leftPercent = cumulative;
                    cumulative += item.value;
                    return (
                        <div
                            key={index}
                            style={{
                                left: `${leftPercent}%`,
                                width: `${item.value}%`
                            }}
                            className="flex items-center justify-start"
                        >
                            <div className="flex items-start gap-2">
                                <div className="">
                                    <div
                                        className={`text-[0.9rem] leading-tight font-normal ${item.evaluated ? '' : 'text-gray-600'}`}
                                        style={{
                                            color: item.evaluated ? item.color : undefined,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {item.evaluated ? (
                                            <>
                                                <div className='flex flex-col'>
                                                    <span className='pl-1 line-clamp-1'>{getShortName(item?.label)}</span>
                                                </div>
                                                {(getProgress() < 100) && (
                                                    <div>
                                                    <i className="pi pi-file-edit mr-1 items-center pl-1" style={{ fontSize: '0.75rem' }}></i>
                                                    <span className='font-normal text-[0.75rem]'>Avaliado</span>
                                                </div>
                                            )
                                        }
                                            </>
                                        ) : (
                                            <>
                                                <div className='flex flex-col'>
                                                    <span className='pl-1 line-clamp-1'>{getShortName(item?.label)}</span>
                                                </div>
                                                {(getProgress() < 100) && (
                                                <div className='w-full'>
                                                    <i className="pi pi-exclamation-circle mr-1 pl-1" style={{ fontSize: '0.75rem', animationDuration: '1.2s' }}></i>
                                                    <span className='font-normal text-[0.75rem]'>Avaliando</span>
                                                </div>)
                                                }
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Exibe informações iniciais (start)
    const start = () => {
        return (
            <div className="flex justify-between mt-3 mb-2 text-[0.9rem] text-gray-600">
                <div className='flex justify-between ' style={{ minWidth: getProgress() + '%' }}>
                    <div><span>Avaliado</span></div>
                    <div>
                        <span>{getProgress()}%</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className=''>
            <div className=" -mt-[2.6rem] w-full">
                <div className='flex justify-end'>
                    <Tag
                        className="h-fit text-[1.15rem] font-medium px-3 gap-2"
                        value="Avaliação"
                        style={{ backgroundColor: '#22c55e', color: '#FFFFFF' }}
                    >
                        <i className='pi pi-file-edit text-lg'></i>
                    </Tag>
                </div>
            </div>
            <div className="card flex flex-col justify-stretch">
                {/* Injeta os estilos de animação */}
                <StyleInjector />
                <MeterGroup
                    start={start}
                    className="w-full"
                    values={sortedItems}
                    meter={meterTemplate}
                    labelList={customLabelList}
                    pt={{
                        metercontainer: {
                            className: 'h-fit border rounded-lg bg-none'
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default StatusAvaliacaoMeteor;
