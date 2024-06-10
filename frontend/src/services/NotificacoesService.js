import {apiClient} from "meutcc/libs/api";

async function getNotificacoesNaoLidas() {
    return apiClient.get('app/notificacoes')
}

async function limparNotificacoes() {
    return apiClient.post('app/limpar-notificacoes')
}

export default {
    getNotificacoesNaoLidas, limparNotificacoes,
}