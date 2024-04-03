import React from 'react';
import { Guards } from 'meutcc/core/constants';
import TabelaTccsPendentes from './listaTccsPendentes';


const AceitarConvitesPage = () => {
    
    return (

        <div>
            

            <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <h1 className='heading-1 text-center text-gray-700'>Convites para Orientar TCCs</h1>
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

AceitarConvitesPage.showMenu = true;
AceitarConvitesPage.guards = [Guards.Auth, Guards.ProfessorInterno];

export default AceitarConvitesPage;