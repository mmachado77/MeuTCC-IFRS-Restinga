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
    getCursoById: (cursoId) => {
        return apiClient.get(`/superadmin/cursos/${cursoId}/`).then(response => response.data);
    },
    updateCurso: (cursoId, cursoData) => {
        return apiClient.put(`/superadmin/cursos/${cursoId}/`, cursoData).then(response => response.data);
    },
    trocarCoordenador: (cursoId, professorId) => {
        return apiClient.put(`/superadmin/cursos/${cursoId}/trocar-coordenador/`, { professor_id: professorId })
            .then(response => response.data);
    },
    getHistoricoCoordenadores: (cursoId) => {
        return apiClient.get(`/superadmin/cursos/${cursoId}/historico-coordenadores/`)
            .then(response => response.data);
    }
    
};

export { AdminCursoService };
export default CursoService;
