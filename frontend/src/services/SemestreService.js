import { apiClient } from "meutcc/libs/api"

async function getPrazoEnvioProposta() {
    return apiClient.get('app/curso/prazo-envio-proposta/').then((response) => response.data);
}

export default {
    getPrazoEnvioProposta,
}