import { apiClient } from "meutcc/libs/api";

async function submeterProposta(data) {
    return apiClient.post('/app/criar-tcc/', data).then((response) => response.data);
}

async function propostaSubmetida() {
    return apiClient.post('/app/proposta-submetida/').then((response) => response.data);
}

export default {
    submeterProposta, propostaSubmetida,
}