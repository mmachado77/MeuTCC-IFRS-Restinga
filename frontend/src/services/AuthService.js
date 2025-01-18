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
    return apiClient.post('/logout').then((response) => response.data); // Certifique-se que o endpoint existe.
}


export default {
    autenticar,
    detalhesUsuario,
    googleCallback,
    detalhesUsuarioPorEmail,
    logout
}