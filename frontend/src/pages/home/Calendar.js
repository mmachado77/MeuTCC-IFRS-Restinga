import { classNames } from 'primereact/utils';
import { Calendar as BaseCalendar } from 'primereact/calendar';

export default function Calendar({ ...props }) {
    return <BaseCalendar
        pt={{
            root: 'p-inputwrapper-filled bg-white p-calendar p-component p-inputwrapper-filled p-inputwrapper-focus p-inputwrapper-filled-focus',
            dayLabel: ({ context }) => ({
                className: classNames(
                    'w-10 h-10 rounded-full transition-shadow duration-200 border-transparent border',
                    'flex items-center justify-center mx-auto overflow-hidden relative',
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                    {
                        'opacity-60 cursor-default': context.disabled,
                        'cursor-pointer': !context.disabled,
                        'bg-green-200 dark:bg-gray-800 hover:bg-green-300 dark:hover:bg-gray-700 font-semibold': !context.disabled,
                    },
                    {
                        'text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80': !context.selected && !context.disabled,
                        'text-blue-700 bg-blue-100 hover:bg-blue-200': context.selected && !context.disabled
                    }
                )
            }),
        }}
        inline
        enabledDates={props.sessoes.map((sessao) => new Date(sessao.data_inicio))}
        yearNavigator={false}
        monthNavigator={false}
        locale='ptbr'
        showOtherMonths={false}
        {...props}
    />;
}