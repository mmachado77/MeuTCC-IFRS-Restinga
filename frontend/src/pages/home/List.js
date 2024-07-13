
import React, { useState, useEffect } from 'react';
import { OrderList } from 'primereact/orderlist';
import CustomAvatar from 'meutcc/components/ui/CustomAvatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { cn } from 'meutcc/libs/utils';
import { Badge } from 'primereact/badge';

export default function BasicDemo({ ...props }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([
            {
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Por que o tiririca é um bom malandro?',
                category: 'Computação',
                dataInicio: new Date(),
                local: 'Campus Restinga, Sala 401 encontrando o professor e o aluno',
                localForma: 'presencial',
            },
            {
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Por que o tiririca é um bom malandro?',
                category: 'Computação',
                dataInicio: new Date(),
                local: 'Campus Restinga, Sala 401 encontrando o professor e o aluno',
                localForma: 'presencial',
            },
            {
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Por que o tiririca é um bom malandro?',
                category: 'Computação',
                dataInicio: new Date(),
                local: 'Campus Restinga, Sala 401 encontrando o professor e o aluno',
                localForma: 'presencial',
            },
            {
                avatar: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Por que o tiririca é um bom malandro?',
                category: 'Computação',
                dataInicio: new Date('2024-07-01 15:00:00'),
                local: 'https://meet.google.com/abc-def-ghi',
                localForma: 'remoto',
            },
        ]);
        // ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap gap-3 p-2 border rounded-md align-items-center hover:bg-gray-100 flex-nowrap ">
                <div className="p-2">
                    <CustomAvatar image={item.avatar} fullname={item.name} className='w-[64px] h-[64px] text-[32px]' shape="circle" />
                </div>
                <div className="p-2">
                    <div className="font-medium">{item.name}</div>
                    <div className='mt-2 mb-4'>
                        <Badge value={item.category}></Badge>
                    </div>
                    <div className="font-light text-gray-500">
                        <div className='flex items-center my-2 flex-nowrap '>
                            <i className='pr-2 pi pi-calendar'></i>
                            <span>{format(item.dataInicio, "dd 'de' MMMM, HH:ii", { locale: ptBR })}</span>
                        </div>
                        <div className='flex items-center my-2 flex-nowrap '>
                            {
                                item.localForma === 'remoto' ?
                                    <i className='pr-2 pi pi-globe'></i>
                                    :
                                    <i className='pr-2 pi pi-map-marker'></i>
                            }
                            {
                                item.localForma === 'remoto' ?
                                    <a
                                        href={item.local}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-blue-500'
                                    >{new URL(item.local).hostname}</a>
                                    :
                                    <span>{item.local}</span>
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={cn(props.className, "overflow-auto card flex flex-col justify-content-center")}>
            {products.map((item) => itemTemplate(item))}
        </div>
    )
}
