import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDetalhesTCC, updateDetalhesTCC, getProximosPassos } from '../services/TccService';
import { useAuth } from '../../../core/context/AuthContext';

const TccContext = createContext();

export const TccProvider = ({ tccId, children }) => {
  const [tccData, setTccData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessaoPrevia, setSessaoPrevia] = useState(null);
  const [sessaoFinal, setSessaoFinal] = useState(null);
  const [proximosPassos, setProximosPassos] = useState(null);
  const { user } = useAuth();

  // Função para buscar os detalhes do TCC
  const fetchData = async () => {
    try {
      const data = await fetchDetalhesTCC(tccId);
      setTccData(data);
      // Se houver sessões, extraímos as sessões prévia e final.
      if (data && data.sessoes && Array.isArray(data.sessoes)) {
        const previa = data.sessoes.find(s => s.tipo.toLowerCase().includes("sessão prévia"));
        const final = data.sessoes.find(s => s.tipo.toLowerCase().includes("sessão final"));
        setSessaoPrevia(previa || null);
        setSessaoFinal(final || null);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do TCC:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar os próximos passos do TCC
  const fetchProximosPassosHandler = async () => {
    try {
      const data = await getProximosPassos(tccId);
      setProximosPassos(data);
    } catch (error) {
      console.error('Erro ao buscar próximos passos:', error);
    }
  };

  useEffect(() => {
    if (tccId) {
      fetchData();
    }
  }, [tccId]);

  useEffect(() => {
    if (tccData) {
      fetchProximosPassosHandler();
    }
  }, [tccData]);

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
        fetchData,
        proximosPassos,
        sessaoPrevia,
        sessaoFinal,
      }}
    >
      {children}
    </TccContext.Provider>
  );
};

export const useTccContext = () => useContext(TccContext);
