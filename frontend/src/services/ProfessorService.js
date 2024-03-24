import { apiClient } from "meutcc/libs/api"

async function getProfessores() {
    return apiClient.get('/app/professores/').then((response) => response.data);
}

export default {
    getProfessores,
}