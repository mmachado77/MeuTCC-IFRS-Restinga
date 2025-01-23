import React, { useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';

const ListaProfessores = ({ curso }) => {
    const [professores, setProfessores] = useState(curso.professores || []);

    const handleAddProfessor = () => {
        // Lógica para adicionar um novo professor (exemplo: abrir um modal ou formulário)
        const novoProfessor = { id: Date.now(), nome: 'Novo Professor', email: 'novo.professor@email.com' }; // Exemplo
        setProfessores((prevProfessores) => [...prevProfessores, novoProfessor]);
    };

    const handleRemoveProfessor = (professorId) => {
        setProfessores((prevProfessores) =>
            prevProfessores.filter((professor) => professor.id !== professorId)
        );
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Professores</h2>
            <ListBox
                value={professores}
                options={professores}
                optionLabel="nome"
                itemTemplate={(professor) => (
                    <div className="flex justify-between items-center">
                        <span>
                            {professor.nome} - {professor.email}
                        </span>
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger p-button-sm"
                            onClick={() => handleRemoveProfessor(professor.id)}
                        />
                    </div>
                )}
            />
            <Button
                label="Adicionar Professor"
                icon="pi pi-plus"
                className="p-button-success mt-4"
                onClick={handleAddProfessor}
            />
        </div>
    );
};

export default ListaProfessores;
