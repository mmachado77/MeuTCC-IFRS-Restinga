import React from 'react';
import { GUARDS } from 'meutcc/core/constants';
import TabelaTccsPendentes from './listaTccsPendentes';
import { useAuth } from 'meutcc/core/context/AuthContext';


const PropostaPendentePage = () => {

    const { user } = useAuth();
    
    return (

        <div>
            

            <div className='max-w-screen-xl mx-auto bg-white m-3 mt-6'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 text-center text-gray-700'>{
                        user.resourcetype === 'Coordenador' ? 'Propostas Pendentes' : 'Propostas Pendentes de Orientação'
                    }</h1>
                    <div className='m-10'>
                        <TabelaTccsPendentes />
                    </div>
                </div>
                <div className="card">
            </div>


                
            </div>
        </div>
    );
};

PropostaPendentePage.guards = [GUARDS.PROFESSOR_EXTERNO, GUARDS.PROFESSOR_INTERNO, GUARDS.COORDENADOR];
PropostaPendentePage.title = 'Propostas Pendentes';

export default PropostaPendentePage;