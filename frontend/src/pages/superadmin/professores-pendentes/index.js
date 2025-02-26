import React from 'react';
import ListaProfessoresInternosPendentes from '../components/listaProfessoresInternosPendentes'
import { GUARDS } from 'meutcc/core/constants';

const SuperAdminPermissoesPage = () => {
    return (
        <div>
            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 text-center text-gray-700'>Professores Internos Pendentes</h1>
                    <div className='m-10'>
                        <ListaProfessoresInternosPendentes />
                    </div>
                </div>
            </div>
        </div>
    );
};

SuperAdminPermissoesPage.guards = [GUARDS.SUPERADMIN];
SuperAdminPermissoesPage.title = 'Permissões SuperAdmin';

export default SuperAdminPermissoesPage;
