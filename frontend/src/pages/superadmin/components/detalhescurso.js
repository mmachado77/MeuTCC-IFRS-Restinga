import React, { useRef, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { parseISO } from 'date-fns';

const DetalhesCurso = ({ curso, setCurso, handleUpdateCurso, router }) => {
    const toast = useRef(null);
    const [originalCurso, setOriginalCurso] = useState({});

    // Função para popular os campos com os dados originais ou do curso atualizado
    const populateFields = (data) => {
        if (data) {
            setCurso({ ...data });
        }
    };

    // Inicializa os dados originais no primeiro carregamento
    useEffect(() => {
        if (curso) {
            setOriginalCurso({ ...curso });
            populateFields(curso);
        }
    }, [curso]);

    // Função para salvar os dados editados
    const handleSave = async () => {
        if (!toast.current) return;

        try {
            const payload = {
                nome: curso.nome,
                sigla: curso.sigla,
                descricao: curso.descricao,
                limite_orientacoes: parseInt(curso.limite_orientacoes, 10),
                regra_sessao_publica: curso.regra_sessao_publica,
                prazo_propostas_inicio: curso.prazo_propostas_inicio,
                prazo_propostas_fim: curso.prazo_propostas_fim,
            };

            // Chamar o serviço de atualização
            await handleUpdateCurso(payload);

            // Atualizar os campos após salvar
            populateFields(payload);

            toast.current.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Curso atualizado com sucesso!',
                life: 3000,
            });
        } catch (error) {
            console.error('Erro ao salvar o curso:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Ocorreu um erro ao salvar o curso.',
                life: 3000,
            });
        }
    };

    // Função para cancelar e restaurar os dados originais
    const handleCancel = () => {
        if (!toast.current) return;

        populateFields(originalCurso);

        toast.current.show({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'Alterações descartadas.',
            life: 3000,
        });
    };

    return (
        <div className="bg-white mb-5 p-4 shadow-md rounded-md border border-gray-200">
            <Toast ref={toast} />
            <h2 className="text-2xl font-bold mb-4">{curso.nome}</h2>

            <div className="flex gap-4 mb-4">
                <div className="flex-1 max-w-[100px]">
                    <label className="block text-sm font-medium mb-2">Sigla</label>
                    <InputText
                        value={curso?.sigla || ''}
                        onChange={(e) => setCurso({ ...curso, sigla: e.target.value })}
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Nome do Curso</label>
                    <InputText
                        value={curso?.nome || ''}
                        onChange={(e) => setCurso({ ...curso, nome: e.target.value })}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <InputText
                    value={curso?.descricao || ''}
                    onChange={(e) => setCurso({ ...curso, descricao: e.target.value })}
                    className="w-full"
                />
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Limite de Orientações</label>
                    <InputText
                        type="number"
                        value={curso?.limite_orientacoes || ''}
                        onChange={(e) => setCurso({ ...curso, limite_orientacoes: e.target.value })}
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Regra de Sessão Pública</label>
                    <Dropdown
                        value={curso?.regra_sessao_publica || ''}
                        options={[
                            { label: 'Desabilitar', value: 'Desabilitar' },
                            { label: 'Opcional', value: 'Opcional' },
                            { label: 'Obrigatório', value: 'Obrigatório' },
                        ]}
                        onChange={(e) => setCurso({ ...curso, regra_sessao_publica: e.value })}
                        placeholder="Selecione uma regra"
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Prazo de Propostas (Início)</label>
                    <Calendar
                        value={parseISO(curso?.prazo_propostas_inicio || new Date().toISOString())}
                        onChange={(e) => setCurso({ ...curso, prazo_propostas_inicio: e.value.toISOString() })}
                        dateFormat="dd/mm/yy"
                        showButtonBar
                        locale="ptbr"
                        className="w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Prazo de Propostas (Fim)</label>
                    <Calendar
                        value={parseISO(curso?.prazo_propostas_fim || new Date().toISOString())}
                        onChange={(e) => setCurso({ ...curso, prazo_propostas_fim: e.value.toISOString() })}
                        dateFormat="dd/mm/yy"
                        showButtonBar
                        locale="ptbr"
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    label="Salvar"
                    icon="pi pi-check"
                    onClick={handleSave}
                    className="p-button-success mr-2"
                />
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={handleCancel}
                    className="p-button-secondary"
                />
            </div>
        </div>
    );
};

export default DetalhesCurso;
