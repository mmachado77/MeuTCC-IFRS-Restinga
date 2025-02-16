import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDetalhesTCC, updateDetalhesTCC, getProximosPassos } from '../services/TccService';
import { useAuth } from '../../../core/context/AuthContext';

const TccContext = createContext();

export const TccProvider = ({ tccId, children }) => {
  const [tccData, setTccData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proximosPassos, setProximosPassos] = useState(null);
  const { user } = useAuth();

  // Função para buscar os detalhes do TCC
  const fetchData = async () => {
    try {
      const data = await fetchDetalhesTCC(tccId);
      setTccData(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do TCC:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar os próximos passos do TCC e atualizar o state
  const fetchProximosPassosHandler = async () => {
    try {
      const data = await getProximosPassos(tccId);
      setProximosPassos(data);
    } catch (error) {
      console.error('Erro ao buscar próximos passos:', error);
    }
  };

  // Busca os detalhes do TCC quando o tccId estiver disponível
  useEffect(() => {
    if (tccId) {
      fetchData();
    }
  }, [tccId]);

  // Após obter os detalhes do TCC, busca os próximos passos
  useEffect(() => {
    if (tccData) {
      fetchProximosPassosHandler();
    }
  }, [tccData]);

  /**
   * Atualiza os detalhes do TCC no backend e atualiza os estados locais:
   * - tccData é recarregado com os dados atualizados.
   * - proximosPassos é atualizado em seguida.
   * @param {Object} updatedData - Dados atualizados do TCC.
   */
  const updateTccDetails = async (updatedData) => {
    setLoading(true);
    try {
      await updateDetalhesTCC(tccId, updatedData);
      await fetchData();
      await fetchProximosPassosHandler();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TccContext.Provider
      value={{
        tccData,
        user,
        loading,
        updateTccDetails,
        proximosPassos,
        fetchData, 
        fetchProximosPassosHandler, 
      }}
    >
      {children}
    </TccContext.Provider>
  );
};

export const useTccContext = () => useContext(TccContext);
