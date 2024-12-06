import React from 'react';
import { useTccContext } from '../context/TccContext';

const DetalhesBody = () => {
    const { tccData, loading, error } = useTccContext();

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="detalhes-body">
            <section>
                <h2>Resumo</h2>
                <p>{tccData?.resumo || 'Resumo não disponível'}</p>
            </section>

            <section>
                <h2>Sessões</h2>
                {tccData?.sessoes?.length > 0 ? (
                    <ul>
                        {tccData.sessoes.map((sessao, index) => (
                            <li key={index}>
                                {sessao.tipo} - {sessao.local}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem sessões cadastradas.</p>
                )}
            </section>

            <section>
                <h2>Avaliações</h2>
                {tccData?.status?.length > 0 ? (
                    <ul>
                        {tccData.status.map((status, index) => (
                            <li key={index}>
                                {status.statusMensagem} - {new Date(status.dataStatus).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem histórico de avaliações.</p>
                )}
            </section>
        </div>
    );
};

export default DetalhesBody;
