import React from 'react';
import { useRouter } from 'next/router';
import { TccProvider } from './context/TccContext';
import MontaTela from './montaTela';

const DetalhesTCCPage = () => {
    const router = useRouter();
    const { tccId } = router.query;

    if (!tccId) return <div>Carregando...</div>;

    return (
        <TccProvider tccId={tccId}>
            <div>
                <MontaTela/>
            </div>
        </TccProvider>
    );
};

export default DetalhesTCCPage;
