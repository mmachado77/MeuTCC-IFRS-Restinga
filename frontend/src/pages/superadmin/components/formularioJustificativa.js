import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import ProfessorService from "meutcc/services/ProfessorService";

export default function FormularioJustificativa({ onSetVisibility, atualizaProfessoresPosAvaliacao, professor }) {
    const [mensagemJustificativa, setMensagemJustificativa] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');

    const handleRecusarProfessorClick = async () => {
        if (mensagemJustificativa.trim() === '') {
            setMensagemErro('A Justificativa é obrigatória.');
            return;
        }
        setMensagemErro('');
        await recusarProfessor();
    };

    const recusarProfessor = async () => {
        try {
            await toast.promise(
                ProfessorService.recusarProfessorInterno(professor.id, mensagemJustificativa),
                {
                    loading: 'Recusando professor...',
                    success: 'Professor recusado com sucesso!',
                    error: 'Erro ao recusar professor.',
                }
            );
            atualizaProfessoresPosAvaliacao();
        } catch (error) {
            console.error('Erro ao recusar professor:', error);
        }
    };

    return (
        <>
            <InputTextarea id="justificativa" value={mensagemJustificativa} onChange={(e) => setMensagemJustificativa(e.target.value)} rows={5} cols={30} className={mensagemErro ? 'p-invalid' : ''} />
            {mensagemErro && <small className='text-red-500'>{mensagemErro}</small>}
            <div className='flex justify-around mt-3'>
                <Button label="Confirmar Recusa" severity="danger" icon="pi pi-check" onClick={handleRecusarProfessorClick} />
                <Button label="Cancelar" severity="secondary" icon="pi pi-times" onClick={() => onSetVisibility(false)} />
            </div>
        </>
    );
}
