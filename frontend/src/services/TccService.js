import { apiClient } from "meutcc/libs/api";

async function submeterProposta(data) {
    return apiClient.post('/app/criar-tcc', data).then((response) => response.data);
}

async function getTccsByAluno() {
    return apiClient.get('/app/tccs-by-aluno').then((response) => response.data);
}

async function getTccsByOrientador() {
    return apiClient.get('/app/tccs-by-orientador').then((response) => response.data);
}

async function getTccsCoordenacao() {
    return apiClient.get('/app/tccs-coordenacao').then((response) => response.data);
}

async function getDetalhesTCC(tccId) {
    return apiClient.get(`/app/detalhes-tcc/${tccId}/`).then((response) => response.data);
}

async function getListarTccsPendente() {
    return apiClient.get('/app/listar-tccs-pendente').then((response) => response.data);
}

async function responderProposta(tccId, data) {
    return apiClient.post(`/app/responder-proposta/${tccId}`, data).then((response) => response.data);
}

async function getPossuiTcc() {
    return apiClient.get('/app/possui-proposta').then((response) => response.data);
}   

async function editarTCC(tccId, data) {
    return apiClient.put(`/app/editar-tcc/${tccId}/`, data).then((response) => response.data);
}

export default {
    submeterProposta, getDetalhesTCC, responderProposta, getListarTccsPendente, getPossuiTcc, getTccsByAluno, getTccsByOrientador, getTccsCoordenacao, editarTCC,
}