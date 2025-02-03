import { apiClient } from "meutcc/libs/api";

async function submeterProposta(data) {
    try {
      const response = await apiClient.post('/app/criar-tcc', data);
      // Retorne um objeto contendo status e dados
      return { 
        status: response.status,
        data: response.data
      };
    } catch (error) {
      // Você pode dar throw para tratar o erro no local que chamar
      throw error; 
    }
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

async function uploadDocumentoTCC(tccId, formData) {
    return apiClient.post(`/app/upload-documento-tcc/${tccId}/`, formData).then((response) => response.data);
}

async function uploadDocumentoSessao(sessaoId, formData) {
    return apiClient.post(`/app/upload-documento-sessao/${sessaoId}/`, formData).then((response) => response.data);
}

async function excluirDocumentoTCC(tccId) {
    return apiClient.delete(`/app/excluir-documento-tcc/${tccId}/`).then((response) => response.data);
}

async function excluirDocumentoSessao(sessaoId) {
    return apiClient.delete(`/app/excluir-documento-sessao/${sessaoId}/`).then((response) => response.data);
}

async function uploadAutorizacaoPublicacao(tccId, formData) {
    return apiClient.post(`/app/upload-autorizacao-publicacao/${tccId}/`, formData).then((response) => response.data);
}

async function downloadDocumentoTCC(tccId) {
    return apiClient.get(`/app/download-documento-tcc/${tccId}/`, { responseType: 'blob' }).then((response) => response.data);
}

async function downloadDocumentoSessao(sessaoId) {
    return apiClient.get(`/app/download-documento-sessao/${sessaoId}/`, { responseType: 'blob' }).then((response) => response.data);
}

async function getTccsPublicados() {
    return apiClient.get('/app/tccs-publicados').then((response) => response.data);
}

async function getTccsByUsuario() {
    return apiClient.get('/app/user-tccs').then((response) => response.data);
}

async function getSugestoes() {
    return apiClient.get('/app/temas-sugeridos').then((response) => response.data);
}

async function getMinhasSugestoes() {
    return apiClient.get('/app/meus-temas-sugeridos').then((response) => response.data);
}

async function createTema(data) {
    return apiClient.post('/app/criar-tema', data).then((response) => response.data);
}

async function updateTema(id, data) {
    return apiClient.put(`/app/atualizar-tema/${id}/`, data).then((response) => response.data);
}

async function deleteTema(id) {
    return apiClient.delete(`/app/excluir-tema/${id}/`).then((response) => response.data);
}


export default {
    submeterProposta,
    getDetalhesTCC,
    responderProposta,
    getListarTccsPendente,
    getPossuiTcc,
    getTccsByAluno,
    getTccsByOrientador,
    getTccsCoordenacao,
    editarTCC,
    uploadDocumentoTCC,
    uploadAutorizacaoPublicacao,
    downloadDocumentoTCC,
    excluirDocumentoTCC,
    uploadDocumentoSessao,
    excluirDocumentoSessao,
    downloadDocumentoSessao,
    getTccsPublicados,
    getSugestoes,
    getMinhasSugestoes,
    createTema,
    updateTema,
    deleteTema,
    getTccsByUsuario
}
