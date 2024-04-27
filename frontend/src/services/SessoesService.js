import { apiClient } from "meutcc/libs/api"

async function getSessoesPendentes() {
    return apiClient.get('/app/sessoes-futuras').then((response) => response.data);
}

export default {
    getSessoesPendentes,
}