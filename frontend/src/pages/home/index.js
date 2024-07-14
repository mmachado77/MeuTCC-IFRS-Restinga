'use client';

import React from 'react';
import List from './List';
import Table from './Table';
import Calendar from './Calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

import SessoesService from 'meutcc/services/SessoesService';
import TccService from 'meutcc/services/TccService';

export default function Page({ sessoes, tccs }) {

    const [scheduleDate, setScheduleDate] = React.useState(new Date());

    console.log({ sessoes, tccs });

    const handleScheduleMonthChange = (e) => {
        const date = new Date(scheduleDate.toISOString());
        date.setMonth(e.month);
        date.setFullYear(e.year);
        setScheduleDate(date);
    }


    return (<>
        <div className='flex flex-col max-w-screen-lg m-3 mx-auto mt-6 bg-white border border-solid rounded-md border-1 border-slate-200'>
            <h1 className='px-5 pt-2 text-2xl font-medium'>Futuros trabalhos</h1>
            <div className='flex flex-row justify-around gap-5 px-5 pt-3 pb-6'>
                <div>
                    <Calendar value={scheduleDate} sessoes={sessoes || []} onMonthChange={handleScheduleMonthChange} />
                </div>
                <div className='w-[550px]'>
                    <h2 className='pt-0 mt-1 text-xl font-medium'>Agendados para {format(scheduleDate, "MMMM 'de' yyyy", { locale: ptBR })}</h2>
                    <List className='h-[350px]' sessoes={sessoes || []} data={scheduleDate} />
                </div>
            </div>
        </div>

        <div className='flex flex-col max-w-screen-lg m-3 mx-auto mt-6 bg-white border border-solid rounded-md border-1 border-slate-200'>
            <h1 className='px-5 pt-2 text-2xl font-medium'>Trabalhos passados</h1>
            <div className='p-5'>
                <Table tccs={tccs} />
            </div>
        </div>
    </>)

}

export async function getServerSideProps() {
    const sessoes = await SessoesService.getSessoesFuturas();
    const tccs = await TccService.getTccsPublicados();

    return { props: { sessoes, tccs } }
}