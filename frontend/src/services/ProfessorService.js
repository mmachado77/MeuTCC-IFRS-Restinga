import { apiClient } from "meutcc/libs/api"

async function getProfessores() {
    return apiClient.get('/app/professores').then((response) => response.data);
}

async function getProfessoresInternos() {
    return apiClient.get('/app/professores-internos').then((response) => response.data);
}

async function getProfessoresPendentes() {
    return apiClient.get('/app/professores-pendentes/')
        .then((response) => response.data);
}

async function aprovarProfessor(professorId) {
    return apiClient.put(`/app/aprovar-professor/${professorId}/`)
        .then((response) => response.data);
}

async function recusarProfessor(professorId, justificativa) {
    return apiClient.put(`/app/recusar-professor/${professorId}/`, { justificativa })
        .then((response) => response.data);
}

// Professores Internos Pendentes
async function getProfessoresInternosPendentes() {
    return apiClient.get('/superadmin/professores-internos-pendentes/')
        .then((response) => response.data);
}

async function aprovarProfessorInterno(professorId) {
    return apiClient.put(`/superadmin/professores-internos/${professorId}/aprovar/`)
        .then((response) => response.data);
}

async function recusarProfessorInterno(professorId, justificativa) {
    return apiClient.put(`/superadmin/professores-internos/${professorId}/recusar/`, { justificativa })
        .then((response) => response.data);
}


export default {
    getProfessores,
    getProfessoresInternos,
    getProfessoresPendentes,
    aprovarProfessor,
    recusarProfessor,
    getProfessoresInternosPendentes,
    aprovarProfessorInterno,
    recusarProfessorInterno
}