import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link';
import { Dialog } from 'primereact/dialog';
import ConfiguracoesService from 'meutcc/services/ConfiguracoesService';

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import toast from 'react-hot-toast';

addLocale('ptbr', {
    today: 'Hoje', clear: 'Limpar', monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'], monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'], dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], weekHeader: 'Semana', firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: '', timeOnlyTitle: 'Só Horas', timeText: 'Tempo', hourText: 'Hora', minuteText: 'Minuto', secondText: 'Segundo', ampm: false, month: 'Mês', week: 'Semana', day: 'Dia', allDayText: 'Todo o Dia'
});

const ConfiguracoesPage = () => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dates, setDates] = useState([]);

    const handleOpenDialog = () => {
        setDialogVisible(true);
    };

    const handleCloseDialog = () => {
        setDialogVisible(false);
    };

    const handleSaveDates = async () => {
        console.log('Data de Início:', dates[0]);
        console.log('Data de Fim:', dates[1]);
        const formatDate = (date) => `${date.getUTCFullYear()}-${date.getUTCMonth().toString().padStart(2, '0')}-${date.getUTCDay().toString().padStart(2, '0')}`;
        const datas = {
            dataAberturaPrazoPropostas: formatDate(dates[0]),
            dataFechamentoPrazoPropostas: formatDate(dates[1])
        }
        setDialogVisible(false);
        const data = await toast.promise(ConfiguracoesService.atualizaDataProposta(datas), {
            loading: 'Conectando...',
            success: 'Conectado!',
            error: 'Erro ao conectar',
        });
    };

    return (
        <div className='max-w-screen-md mx-auto bg-white m-3 mt-6'>
            <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                <h1 className='heading-1 text-center text-gray-700'>Configurações</h1>
            </div>

            <div className='py-6 px-9 grid grid-cols-3 gap-4'>
                <Button icon="pi pi-calendar" label="Prazo Envio de Propostas" size="large" outlined onClick={handleOpenDialog} />
                <Link href='/propostas-pendentes'>
                    <Button icon="pi pi-list" label="Propostas de TCC" size="large" outlined />
                </Link>
                <Link href='/permissoes-usuarios'>
                    <Button icon="pi pi-users" label="Permissões de Usuários" size="large" outlined />
                </Link>
            </div>

            <Dialog header="Envio de Propostas" visible={dialogVisible} style={{ width: 'fit-content' }} onHide={handleCloseDialog}>
                <label>Período: </label>
                <Calendar 
                    value={dates} 
                    onChange={(e) => setDates(e.value)} 
                    dateFormat='dd/mm/yy' 
                    locale='ptbr' 
                    selectionMode="range" 
                    readOnlyInput 
                    hideOnRangeSelection 
                    showButtonBar />
                <div className="flex justify-between mt-5">
                    <Button onClick={handleSaveDates} label="Salvar" severity="success" />
                    <Button onClick={handleCloseDialog} label="Cancelar" severity="danger" />
                </div>
            </Dialog>
        </div>
    );
};

ConfiguracoesPage.showMenu = true;
export default ConfiguracoesPage;
