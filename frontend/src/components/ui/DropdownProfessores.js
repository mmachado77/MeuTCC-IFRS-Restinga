import React from 'react';
import { useRouter } from 'next/router';
import { Dropdown } from 'primereact/dropdown';
import ProfessorService from 'meutcc/services/ProfessorService';

export default function DropdownProfessores({...props}) {
const [selectedProfessor, setSelectedProfessor] = React.useState(null);
const [professores, setProfessores] = React.useState(null);
const router = useRouter();
    
    React.useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const data = await ProfessorService.getProfessores();
                const professores = data.map((professor) => ({ name: professor.nome, value: professor.id }));
    
                setProfessores(professores);

            } catch (error) {
                console.error('Erro ao buscar professores', error);
            }
        };
        fetchProfessores();
    }, []);   

    return(
        <div className=''>
            <Dropdown {...props} name='avaliador' options={professores} optionLabel="name" placeholder="" className="w-full md:w-14rem"/>
        </div>
    )

}

