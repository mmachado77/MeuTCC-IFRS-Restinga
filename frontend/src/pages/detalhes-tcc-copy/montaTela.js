import React from 'react';
import { useRouter } from 'next/router';
import { useTccContext } from './context/TccContext';
import { TccProvider } from './context/TccContext';
import DetalhesHeader from './components/DetalhesHeader';
import CardTccDetalhes from './components/CardTccDetalhes';
import CardEdit from './components/CardEdit';

const MontaTela = () => {

    const { user } = useTccContext();

    // TODO: Ajustar lógica para ver se pode edita

    return (

            <div className="p-4 max-w-screen-lg mx-auto bg-white mt-6 rounded-lg">
                {console.log(user)}
                <div className="flex gap-4">
                    <div className="w-3/5">
                        <CardTccDetalhes />
                    </div>
                    {/* Renderiza o CardEdit apenas se o usuário for coordenador */}
                    {user?.tipo === 'Coordenador' && (
                        <div className="w-2/5">
                            <CardEdit />
                        </div>
                    )}
                </div>
            </div>

    );
};

export default MontaTela;
