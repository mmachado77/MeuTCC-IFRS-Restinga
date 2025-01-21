import { apiClient } from 'meutcc/libs/api';

const CursoService = {
    getCursosSimplificados: () => {
        return apiClient.get('/app/cursos-simplificados').then(response => response.data); // Endpoint específico
    },
};

const AdminCursoService = {
    getCursos: () => {
        return apiClient.get('/superadmin/cursos/').then(response => response.data); // Endpoint para superadmin
    },
    // Método para buscar detalhes de um curso pelo ID
    getCursoById: (id) => {
        return apiClient.get(`/superadmin/cursos/${id}/`).then(response => response.data);
    },

    // Método para atualizar os dados de um curso
    updateCurso: (id, cursoData) => {
        return apiClient.put(`/superadmin/cursos/${id}/`, cursoData).then(response => response.data);
    },
};

export { AdminCursoService };
export default CursoService;
