import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import ProfessorService from 'meutcc/services/ProfessorService'; 
import AlternarCoordenadorService from 'meutcc/services/ConfiguracoesService';
import { Button } from "primereact/button";
import toast from "react-hot-toast";

export default function ProfessoresDropdown() {
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [professores, setProfessores] = useState([]);

    useEffect(() => {
        async function fetchProfessores() {
            try {
                const data = await ProfessorService.getProfessoresInternos(); // Chama a função que obtém os professores do serviço
                const professores2 = data.map((professor) => ({ name: professor.nome, value: professor.id }));
                setProfessores(professores2); // Define os dados dos professores no estado local
            } catch (error) {
                console.error('Erro ao buscar professores', error);
            }
        }

        fetchProfessores(); // Chama a função para buscar os professores quando o componente for montado
    }, []);

    const handleAlternarCoordenador = async () => {
        const coordenador = selectedProfessor
        const data = await toast.promise(AlternarCoordenadorService.alterarCoordenador({coordenador}), {
            loading: 'Alterando Coordenador...',
            success: 'Coordenador Atualizado com Sucesso!',
            error: 'Erro ao Alterar',
        });
    };

    return (
        <div className="">
            <div className="flex justify-around items-center">
                <div>
                    <p className="font-bold text-gray-700 text-lg">Alterar Coordenador:</p>
                </div>
                <div>
                    <Dropdown 
                        inputId="dd-professor" 
                        value={selectedProfessor} 
                        onChange={(e) => setSelectedProfessor(e.value)} 
                        options={professores} 
                        placeholder="Selecione o novo Professor"
                        optionLabel="name" 
                    />
                </div>
                
            </div>
            <div>
            <Button label="Confirmar" severity="success" className="w-full" icon='pi pi-check' iconPos='right' onClick={handleAlternarCoordenador}/>
            </div>
            </div>
    )
}
