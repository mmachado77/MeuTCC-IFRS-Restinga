import { apiClient } from "meutcc/libs/api";

async function getProfessoresInternosPendentes() {
    return apiClient.get('/app/professores-internos-pendentes').then((response) => response.data);
}

async function getProfessoresExternosPendentes() {
    return apiClient.get('/app/professores-externos-pendentes').then((response) => response.data);
}

export default {
    getProfessoresInternosPendentes,
    getProfessoresExternosPendentes
}
