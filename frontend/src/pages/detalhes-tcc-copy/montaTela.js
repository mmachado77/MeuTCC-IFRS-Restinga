import React from 'react';
import { useRouter } from 'next/router';
import { useTccContext } from './context/TccContext';
import { TccProvider } from './context/TccContext';
import DetalhesHeader from './components/DetalhesHeader';
import FileItemTCC from './components/FileItemTCC';
import CardTccDetalhes from './components/CardTccDetalhes';
import CardEdit from './components/CardEdit';

const MontaTela = () => {

    const { tccData, user, updateTccDetails } = useTccContext();
    const isEditable = (
        (user?.tipo === 'Coordenador' && user?.curso === tccData?.curso?.id) ||
        (user?.id && tccData?.autor?.id && user.id === tccData.autor.id) ||
        (user?.id && tccData?.orientador?.id && user.id === tccData.orientador.id)
      );

    // TODO: Ajustar lógica para ver se pode edita

    return (

            <div className="p-4 max-w-screen-lg mx-auto bg-white mt-6 rounded-lg">
                <div className="flex gap-4">
                    <div className="w-3/5">
                        <CardTccDetalhes />
                    </div>
                    {/* Renderiza o CardEdit apenas se o usuário for coordenador */}
                    
                        <div className="w-2/5 flex flex-col gap-4">
                        {isEditable && (
                            <CardEdit />
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
