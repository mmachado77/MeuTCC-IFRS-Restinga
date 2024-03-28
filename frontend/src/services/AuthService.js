import { apiClient } from "meutcc/libs/api";

async function autenticar(data) {
    return apiClient.post('/app/autenticar', data).then((response) => response.data);
}

export default {
    autenticar,
}