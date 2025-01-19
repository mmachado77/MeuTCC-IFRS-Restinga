import { apiClient } from "meutcc/libs/api";

async function autenticar(data) {
    return apiClient.post('/app/autenticar', data).then((response) => response.data);
}

async function detalhesUsuario() {
    return apiClient.get('/app/detalhes-usuario').then((response) => response.data);
}

async function googleCallback(params) {
    return apiClient.get('/app/callback' + params).then((response) => response.data); 
}

async function detalhesUsuarioPorEmail(email) {
    return apiClient.get(`/app/detalhes-usuario?email=${encodeURIComponent(email)}`)
        .then(response => response.data);
}

async function logout() {
    try {
        // Tenta notificar o backend sobre o logout
        await apiClient.post('/logout');
    } catch (error) {
        console.error('Erro ao realizar logout no backend:', error);
        // Opcional: pode decidir exibir mensagens ao usuário ou ignorar silenciosamente
    } finally {
        // Limpa sempre o estado local do usuário
        localStorage.removeItem('token');
        localStorage.removeItem('isSuperAdmin');
    }
}


export default {
    autenticar,
    detalhesUsuario,
    googleCallback,
    detalhesUsuarioPorEmail,
    logout
}