import { Calendar } from 'primereact/calendar';
import React from 'react';
import List from './List';
import Table from './Table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

const Home = () => {

    const [scheduleDate, setScheduleDate] = React.useState(new Date());

    const events = [
        new Date('2024-07-01 00:00:00'),
    ];

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
                    <Calendar
                        inline
                        enabledDates={events}
                        yearNavigator={false}
                        monthNavigator={false}
                        locale='ptbr'
                        showOtherMonths={false}
                        onMonthChange={handleScheduleMonthChange}
                    />
                </div>
                <div>
                    <h2 className='pt-0 mt-1 text-xl font-medium'>Agendados para {format(scheduleDate, "MMMM 'de' yyyy", { locale: ptBR })}</h2>
                    <List className='h-[350px]' />
                </div>
            </div>
        </div>

        <div className='flex flex-col max-w-screen-lg m-3 mx-auto mt-6 bg-white border border-solid rounded-md border-1 border-slate-200'>
            <h1 className='px-5 pt-2 text-2xl font-medium'>Trabalhos passados</h1>
            <div className='p-5'>
                <Table />
            </div>
        </div>
    </>)

}

export default Home;