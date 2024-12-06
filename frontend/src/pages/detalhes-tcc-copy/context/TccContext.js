import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDetalhesTCC } from '../services/TccService';

const TccContext = createContext();

export const TccProvider = ({ tccId, children }) => {
    const [tccData, setTccData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const carregarDetalhes = async () => {
            try {
                setLoading(true);
                const data = await fetchDetalhesTCC(tccId);
                setTccData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (tccId) carregarDetalhes();
    }, [tccId]);

    const currentStatus = tccData?.status?.[tccData.status.length - 1];

    return (
        <TccContext.Provider value={{ tccData, currentStatus, loading, error }}>
            {children}
        </TccContext.Provider>
    );
};

export const useTccContext = () => useContext(TccContext);
