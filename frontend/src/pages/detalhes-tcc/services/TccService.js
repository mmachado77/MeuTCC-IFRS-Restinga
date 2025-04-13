import { apiClient } from 'meutcc/libs/api';

/**
 * Busca os detalhes de um TCC com base no ID fornecido.
 * @param {string} tccId - ID do TCC a ser buscado.
 * @returns {Promise<Object>} - Dados do TCC.
 */
export async function fetchDetalhesTCC(tccId) {
    try {
        const response = await apiClient.get(`/app/detalhes-tcc/${tccId}/`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao buscar detalhes do TCC');
    }
}

/**
 * Atualiza os detalhes de um TCC específico.
 * @param {string} tccId - ID do TCC a ser atualizado.
 * @param {Object} data - Dados a serem enviados para atualização.
 * @returns {Promise<Object>} - Resposta da API após a atualização.
 */
export async function updateDetalhesTCC(tccId, data) {
    try {
        const response = await apiClient.patch(`/app/editar-tcc/${tccId}/`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

/**
 * Busca os próximos passos do TCC com base no ID fornecido.
 * @param {string} tccId - ID do TCC para o qual os próximos passos serão buscados.
 * @returns {Promise<Object>} - Dados referentes aos próximos passos do TCC.
 * @throws {Error} - Em caso de falha na requisição, lança erro com a mensagem apropriada.
 */
export async function getProximosPassos(tccId) {
    try {
        // Alterado para POST, pois o endpoint espera esse método.
        const response = await apiClient.post('/app/proximos-passos', { tccid: tccId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao buscar os próximos passos do TCC');
    }
}

