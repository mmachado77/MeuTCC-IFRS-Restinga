import { apiClient } from "meutcc/libs/api";

async function submeterProposta(data) {
    return apiClient.post('/app/criar-tcc/', data).then((response) => response.data);
}

export default {
    submeterProposta,
}