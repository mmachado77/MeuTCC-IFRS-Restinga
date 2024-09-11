import { apiClient } from "meutcc/libs/api";

async function search(query) {
    try {
        const response = await apiClient.get('/app/search', { params: { q: query } });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
        throw error;
    }
}

export default {
    search,
};
