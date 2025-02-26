import { apiClient } from "meutcc/libs/api"

//TODO: Eliminar esse Service em Produção
async function listarUsuarios() {
    return apiClient.get('app/listar-usuarios')
}

async function listarUsuariosSuperAdmin() {
    return apiClient.get('/superadmin/listar-usuarios')
}

async function criarUsuario(data) {
    return apiClient.post('app/criar-usuario', data)
}

async function getPerfilById(id) {
    const response = await apiClient.get(`/app/perfil/${id}/`);
    return response.data;
}

async function getTccsByUsuarioId(id) {
    const response = await apiClient.get(`/app/tccs-by-usuario/${id}/`);
    return response.data;
}


async function atualizarPerfil(data) {
    return apiClient.put(`/app/perfil/${data.id}/`, data).then((response) => response.data);
}

export default {
    listarUsuarios,
    listarUsuariosSuperAdmin,
    criarUsuario,
    getPerfilById,
    getTccsByUsuarioId,
    atualizarPerfil
}