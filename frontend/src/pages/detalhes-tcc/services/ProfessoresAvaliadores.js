import { apiClient } from "meutcc/libs/api";
const ProfessoresAvaliadores = {
    async getProfessoresByCurso() {
        try {
            const response = await apiClient.get('app/curso/professores/');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar professores do curso", error);
            throw error;
        }
    },
};

export default ProfessoresAvaliadores;
