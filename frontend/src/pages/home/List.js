import React, { useState, useEffect } from 'react';
import CustomAvatar from 'meutcc/components/ui/CustomAvatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { cn } from 'meutcc/libs/utils';
import { Badge } from 'primereact/badge';
import Dialog from './Dialog';

export default function List({ ...props }) {
    const [listaSessoes, setListaSessoes] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [sessaoSelecionada, setSessaoSelecionada] = useState(null);

    const handleDialogSessaoClick = (sessao) => () => {
        setSessaoSelecionada(sessao);
        setDialogVisible(true);
    }

    const sessaoTemplate = (sessao) => {
        return (
            <div className="flex flex-wrap gap-3 p-2 border rounded-md cursor-pointer align-items-center hover:bg-gray-100 flex-nowrap " onClick={handleDialogSessaoClick(sessao)}>
                <div className="p-2">
                    <CustomAvatar image={sessao.tcc.autor.avatar} fullname={sessao.tcc.autor.nome} className='w-[48px] h-[48px] text-[24px]' shape="circle" />
                </div>
                <div className="p-2">
                    <div className="font-medium">{sessao.tcc.tema}</div>
                    <div className="font-light text-gray-500">
                        <div className='flex items-center my-2 flex-nowrap '>
                            <i className='pr-2 pi pi-calendar'></i>
                            <span>{format(sessao.data_inicio, "dd 'de' MMMM, HH:ii", { locale: ptBR })}</span>
                        </div>
                        <div className='flex items-center my-2 flex-nowrap '>
                            {
                                sessao.forma_apresentacao === 'remoto' ?
                                    <i className='pr-2 pi pi-globe'></i>
                                    :
                                    <i className='pr-2 pi pi-map-marker'></i>
                            }
                            {
                                sessao.forma_apresentacao === 'remoto' ?
                                    <a
                                        href={sessao.local}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-blue-500'
                                    >{new URL(sessao.local).hostname}</a>
                                    :
                                    <span>{sessao.local}</span>
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        setListaSessoes(props.sessoes.filter((sessao) => {
            const dataInicio = new Date(sessao.data_inicio);
            const data = new Date(props.data);
            return dataInicio.getFullYear() === data.getFullYear() && dataInicio.getMonth() === data.getMonth();
        }));
    }, [props.data]);

    return (
        <div className={cn(props.className, "overflow-auto card flex flex-col justify-content-center")}>
            {
                listaSessoes.length === 0 ?
                    <div className="p-4 text-center text-gray-500">Nenhuma sessão agendada para este mês</div>
                    :
                    listaSessoes.map((item) => sessaoTemplate(item))
            }

            <Dialog visible={dialogVisible} setVisible={setDialogVisible} sessao={sessaoSelecionada} />
        </div>
    )
}
