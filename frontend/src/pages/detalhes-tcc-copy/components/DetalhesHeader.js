import React from 'react';
import { useTccContext } from '../context/TccContext';

const DetalhesHeader = () => {
    const { tccData, currentStatus, loading, error } = useTccContext();

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <header className="detalhes-header">
            <h1>{tccData?.tema}</h1>
            <p>Status Atual: {currentStatus?.statusMensagem || 'Indisponível'}</p>
            <p>Orientador: {tccData?.orientador?.nome || 'Não definido'}</p>
        </header>
    );
};

export default DetalhesHeader;
