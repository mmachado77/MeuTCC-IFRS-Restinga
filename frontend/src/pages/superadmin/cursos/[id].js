import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import DetalhesCurso from '../components/detalhescurso';
import CoordenadorAtual from '../components/coordenadoratual';
import { AdminCursoService } from '../../../services/CursoService'; // Atualize o caminho conforme necessário

const CursoDetalhes = () => {
    const router = useRouter();
    const { id } = router.query;
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchCurso = async () => {
                try {
                    const data = await AdminCursoService.getCursoById(id);
                    setCurso(data);
                } catch (error) {
                    console.error('Erro ao buscar curso:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCurso();
        }
    }, [id]);

    const handleAddProfessor = () => {
        // Lógica para adicionar um novo professor
    };

    const handleRemoveProfessor = (professorId) => {
        // Lógica para remover um professor específico
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="p-4 max-w-screen-lg mx-auto">
            <Card className="text-gray-700 border border-gray-200 border-solid rounded-lg shadow-md shadow-gray-300">
                <DetalhesCurso curso={curso} />
                <CoordenadorAtual curso={curso} />
                <div>
                    <h2 className="text-lg font-bold mb-2">Professores</h2>
                    <ListBox
                        value={curso.professores}
                        options={curso.professores}
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
            </Card>
        </div>
    );
};

export default CursoDetalhes;
