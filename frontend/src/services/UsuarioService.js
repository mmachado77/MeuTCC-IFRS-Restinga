import { apiClient } from "meutcc/libs/api"

async function listarUsuarios() {
    return apiClient.get('app/listar-usuarios')
}

export default {
    listarUsuarios
}