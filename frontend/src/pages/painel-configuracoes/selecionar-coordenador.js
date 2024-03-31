import React, { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import ProfessorService from 'meutcc/services/ProfessorService'; 

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

    return (
            <div className="card">
                    <Dropdown 
                        inputId="dd-professor" 
                        value={selectedProfessor} 
                        onChange={(e) => setSelectedProfessor(e.value)} 
                        options={professores} 
                        placeholder="Selecione o novo Professor"
                        optionLabel="name" 
                        className="w-full" 
                    />
            </div>
    )
}
