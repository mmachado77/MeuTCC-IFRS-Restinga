import React, { useState } from 'react';
import TabelaProfessores from './listaProfessoresPendentes'
import { GUARDS } from 'meutcc/core/constants';

const AtualizarPermissoesPage = () => {

    return (

        <div>
            

            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 text-center text-gray-700'>Cadastros Pendentes</h1>
                    <div className='m-10'>
                        <TabelaProfessores />
                    </div>
                </div>
                <div className="card">
            </div>


                
            </div>
        </div>
    );
};

AtualizarPermissoesPage.guards = [GUARDS.COORDENADOR];
AtualizarPermissoesPage.title = 'Atualizar Permissões';

export default AtualizarPermissoesPage;