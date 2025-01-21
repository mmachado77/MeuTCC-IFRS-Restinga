import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { ListBox } from 'primereact/listbox';
import CustomAvatar from '../../../components/ui/CustomAvatar'; // Componente CustomAvatar
import { AdminCursoService } from '../../../services/CursoService'; // Atualize o caminho conforme necessário
import DetalhesCurso from '../components/detalhescurso';

const CursoDetalhes = () => {
    const router = useRouter();
    const { id } = router.query;
    const [curso, setCurso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false); // Controla a exibição do diálogo

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

    const handleUpdateCurso = async (dadosAtualizados) => {
        try {
            // Exemplo de chamada para API
            await AdminCursoService.updateCurso(curso.id, dadosAtualizados);
        } catch (error) {
            throw new Error('Erro ao atualizar o curso.');
        }
    };
    

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
            <DetalhesCurso curso={curso} setCurso={setCurso} handleUpdateCurso={handleUpdateCurso} router={router} />
                <Card className="mb-4" title="Coordenador Atual">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start items-center">
                            <CustomAvatar
                                className="w-[80px] h-[80px] text-[40px]"
                                fullname={curso?.coordenador_atual?.nome || ''}
                                size="xlarge"
                                shape="circle"
                            />
                            <div className="ml-5">
                                <div>
                                    <label className="text-lg font-bold text-gray-700">
                                        {curso.coordenador_atual?.nome || 'Coordenador não definido'}
                                    </label>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-700">
                                        {`Email: ${curso.coordenador_atual?.email || 'Não disponível'}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button
                                label="Ver Histórico"
                                severity="warning"
                                icon="pi pi-history"
                                outlined
                                onClick={() => setVisible(true)}
                            />
                            <Dialog
                                header="Histórico de Alterações"
                                visible={visible}
                                style={{ width: '50vw' }}
                                onHide={() => setVisible(false)}
                            >
                                <Timeline
                                    value={curso.historico_coordenadores || []}
                                    opposite={(item) => item.coordenador}
                                    content={(item) => <small>{item.data_alteracao}</small>}
                                />
                            </Dialog>
                        </div>
                    </div>
                </Card>

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
