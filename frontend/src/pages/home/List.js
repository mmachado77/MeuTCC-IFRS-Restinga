import React, { useState, useEffect } from 'react';
import CustomAvatar from 'meutcc/components/ui/CustomAvatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { cn } from 'meutcc/libs/utils';
import { Badge } from 'primereact/badge';

export default function BasicDemo({ ...props }) {
    const [listaSessoes, setListaSessoes] = useState([]);

    useEffect(() => {
        setListaSessoes(props.sessoes.filter((sessao) => {
            const dataInicio = new Date(sessao.data_inicio);
            const data = new Date(props.data);
            return dataInicio.getFullYear() === data.getFullYear() && dataInicio.getMonth() === data.getMonth();
        }));
    }, [props.data]);

    const sessaoTemplate = (sessao) => {
        return (
            <div className="flex flex-wrap gap-3 p-2 border rounded-md align-items-center hover:bg-gray-100 flex-nowrap ">
                <div className="p-2">
                    <CustomAvatar image={sessao.tcc.autor.avatar} fullname={sessao.tcc.autor.nome} className='w-[64px] h-[64px] text-[32px]' shape="circle" />
                </div>
                <div className="p-2">
                    <div className="font-medium">{sessao.tcc.tema}</div>
                    <div className='mt-2 mb-4'>
                        <Badge value={sessao.tipo}></Badge>
                    </div>
                    <div className="font-light text-gray-500">
                        <div className='flex items-center my-2 flex-nowrap '>
                            <i className='pr-2 pi pi-calendar'></i>
                            <span>{format(sessao.data_inicio, "dd 'de' MMMM, HH:ii", { locale: ptBR })}</span>
                        </div>
                        <div className='flex items-center my-2 flex-nowrap '>
                            {
                                sessao.localForma === 'remoto' ?
                                    <i className='pr-2 pi pi-globe'></i>
                                    :
                                    <i className='pr-2 pi pi-map-marker'></i>
                            }
                            {
                                sessao.localForma === 'remoto' ?
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

    return (
        <div className={cn(props.className, "overflow-auto card flex flex-col justify-content-center")}>
            {listaSessoes.map((item) => sessaoTemplate(item))}
        </div>
    )
}
