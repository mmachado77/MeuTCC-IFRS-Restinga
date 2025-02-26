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
                ProfessorService.recusarProfessor(professor.id, mensagemJustificativa),
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

    return (<>
        <span className="p-float-label">
            <InputTextarea className={(mensagemErro ? 'p-invalid' : '')} id="justificativa" value={mensagemJustificativa} onChange={(e) => setMensagemJustificativa(e.target.value)} rows={5} cols={30} />
            <label htmlFor="justificativa">Justifique o motivo para a recusa</label>
        </span>
        {mensagemErro && <small id='tema-help' className='px-2 py-1 text-red-500'>{mensagemErro}</small>}
        <div className='flex justify-around mt-3'>
            <div>
                <Button label="Confirmar Recusa" severity="danger" icon='pi pi-check' iconPos='right' onClick={handleRecusarProfessorClick} />
            </div>
            <div>
                <Button label="Cancelar" severity="secondary" icon='pi pi-times' iconPos='right' onClick={() => onSetVisibility(false)} />
            </div>
        </div>
    </>)
}
