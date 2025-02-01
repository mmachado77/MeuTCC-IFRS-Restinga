import { apiClient } from "meutcc/libs/api";
const SubmeterServices = {
    async getProfessoresByCurso() {
        try {
            const response = await apiClient.get('app/curso/professores/');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar professores do curso", error);
            throw error;
        }
    },

    async getPrazoEnvioProposta() {
        try {
            const response = await apiClient.get('app/curso/prazo-envio-proposta/');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar prazo de envio de proposta", error);
            throw error;
        }
    }
};

export default SubmeterServices;
