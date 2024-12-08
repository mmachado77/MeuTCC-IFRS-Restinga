import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDetalhesTCC } from '../services/TccService';
import { useAuth } from '../../../core/context/AuthContext'; // Importa o AuthContext

const TccContext = createContext();

export const TccProvider = ({ tccId, children }) => {
    const [tccData, setTccData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); // Obtém o usuário diretamente do AuthContext

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchDetalhesTCC(tccId);
                setTccData(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (tccId) {
            fetchData();
        }
    }, [tccId]);

    return (
        <TccContext.Provider value={{ tccData, user, loading }}>
            {children}
        </TccContext.Provider>
    );
};

export const useTccContext = () => useContext(TccContext);
