import { apiClient } from "meutcc/libs/api";

async function atualizaDataProposta(data) {
    return apiClient.put('/app/atualizar-datas-propostas', data).then((response) => response.data);
}

async function alterarCoordenador(data) {
    return apiClient.put('/app/alterar-coordenador', data).then((response) => response.data);
}

async function getCoordenador() {
    return apiClient.get('/app/coordenador').then((response) => response.data);
}

async function getSemestreAtual() {
    return apiClient.get('/app/semestre-atual').then((response) => response.data);
}

async function getHistoricoCoordenadores() {
    return apiClient.get('/app/historico-coordenadores').then((response) => response.data);
}

export default {
    atualizaDataProposta,
    alterarCoordenador,
    getCoordenador,
    getSemestreAtual,
    getHistoricoCoordenadores
}
