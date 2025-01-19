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
};

export { AdminCursoService };
export default CursoService;
