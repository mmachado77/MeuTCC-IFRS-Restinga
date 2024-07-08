import { apiClient } from "meutcc/libs/api";

async function avaliar(sessaoId, data) {
    return apiClient.post(`/app/avaliar/${sessaoId}/`, data).then((response) => response.data);
}

export default {
    avaliar
}
