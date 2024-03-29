import { apiClient } from "meutcc/libs/api";

async function atualizaDataProposta(data) {
    return apiClient.put('/app/atualizar-datas-propostas', data).then((response) => response.data);
}

export default {
    atualizaDataProposta
}