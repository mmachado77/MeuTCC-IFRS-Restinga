import { apiClient } from "meutcc/libs/api"

async function listarUsuarios() {
    return apiClient.get('app/listar-usuarios')
}

async function criarUsuario(data) {
    return apiClient.post('app/criar-usuario', data)
}



export default {
    listarUsuarios,
    criarUsuario
}