import { apiClient } from "meutcc/libs/api";

async function submeterProposta(data) {
    return apiClient.post('/app/criar-tcc', data).then((response) => response.data);
}

async function propostaSubmetida() {
    return apiClient.post('/app/proposta-submetida').then((response) => response.data);
}

async function getTccs() {
    return apiClient.get('/app/tccs').then((response) => response.data);
}

async function getDetalhesTCC(id) {
    return apiClient.get('/app/detalhes-tcc/'+ id +'/').then((response) => response.data);
}

async function getConvitesPendentes() {
    return apiClient.get('/app/listar-tccs-pendente').then((response) => response.data);
}

async function aceitarConvite(tccId) {
    return apiClient.post(`/app/atualizar-tcc-status/${tccId}`, {status:"PROPOSTA_ANALISE_COORDENADOR"}).then((response) => response.data);
}

async function recusarConvite(tccId, data) {
    return apiClient.post(`/app/atualizar-tcc-status/${tccId}`, {status:"PROPOSTA_RECUSADA_ORIENTADOR", justificativa:data.justificativa}).then((response) => response.data);
}

export default {
    submeterProposta, propostaSubmetida, getTccs, getConvitesPendentes, aceitarConvite, recusarConvite, getDetalhesTCC
}