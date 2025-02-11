import React from 'react';
import { useTccContext } from './context/TccContext';
import FileItemTCC from './components/FileItemTCC';
import CardTccDetalhes from './components/CardTccDetalhes';
import CardEdit from './components/CardEdit';
import CardProximoPassos from './components/CardProximoPassos';

const MontaTela = () => {

    const { tccData, user, updateTccDetails } = useTccContext();
    const isEditable = user && tccData && (
        (user.tipo === 'Coordenador' && user.curso === tccData?.curso?.id) ||
        (user.id && tccData.autor?.id && user.id === tccData.autor.id) ||
        (user.id && tccData.orientador?.id && user.id === tccData.orientador.id)
    );

    return (

            <div className="p-4 max-w-screen-lg mx-auto bg-white my-6 rounded-lg">
                <div className="flex gap-4">
                    <div className="w-3/5">
                        <CardTccDetalhes isEditable={isEditable}/>
                    </div>
                    {/* Renderiza o CardEdit apenas se o usuário for coordenador */}
                    
                        <div className="w-2/5 flex flex-col gap-4">
                        {isEditable && (
                            <CardProximoPassos
                            tccId={tccData?.id}
                            isEditable={isEditable}
                            />
                        )}
                        <FileItemTCC 
                            file={tccData?.documentoTCC} 
                            tccId={tccData?.id} 
                            prazoEntrega=""
                            user={user}
                            isEditable={isEditable}
                            updateTccDetails={updateTccDetails}
                        />
                        </div>
                    
                </div>
            </div>

    );
};

export default MontaTela;
