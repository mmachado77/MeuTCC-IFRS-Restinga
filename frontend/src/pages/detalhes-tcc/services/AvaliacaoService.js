import { apiClient } from "meutcc/libs/api";

async function downloadFichaAvaliacaoPreenchida(avaliacaoId) {
    return apiClient.get(`/app/download-ficha-avaliacao-preenchida/${avaliacaoId}/`, { responseType: 'blob' }).then((response) => response.data);
}

async function uploadFichaAvaliacao(avaliacaoId, formData) {
    return apiClient
        .post(`/app/upload-ficha-avaliacao/${avaliacaoId}/`, formData)
        .then((response) => response.data);
}

async function downloadFichaAvaliacao(avaliacaoId) {
    return apiClient
        .get(`/app/download-ficha-avaliacao/${avaliacaoId}/`, { responseType: 'blob' })
        .then(response => response.data);
}

export default {
    downloadFichaAvaliacaoPreenchida,
    downloadFichaAvaliacao,
    uploadFichaAvaliacao,
}
