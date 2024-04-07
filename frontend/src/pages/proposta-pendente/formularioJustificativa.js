import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import TccService from "meutcc/services/TccService";

export default function formularioJustificativa({onSetVisibility, onPosAvaliacao, tcc}) {
    const [mensagemJustificativa, setMensagemJustificativa] = useState('');
    
    const [mensagemErro, setMensagemErro] = useState('');

    const handleRecusarProfessorClick = async () => {
        if (mensagemJustificativa === '') {
            setMensagemErro('A Justificativa é obrigatória.');
            return
        }
        setMensagemErro('');
        recusarConvite()
    }

    const recusarConvite = async () => {
        const data = await toast.promise(TccService.responderProposta(tcc.id, {
            aprovar: false,
            justificativa: mensagemJustificativa
        }), {
            loading: 'Recusando convite de proposta de tcc...',
            success: 'convite de proposta de tcc recusado com sucesso!',
            error: 'Erro ao recusar convite de proposta de tcc.',
        });
        onPosAvaliacao()
    };

    return (<>
        <span className="p-float-label">
            <InputTextarea className={(mensagemErro ? 'p-invalid' : '')} id="justificativa" value={mensagemJustificativa} onChange={(e) => setMensagemJustificativa(e.target.value)} rows={5} cols={30} />
            <label htmlFor="justificativa">Justifique o motivo para a recusa</label>
        </span>
            { mensagemErro && <small id='tema-help' className='text-red-500 py-1 px-2'>{mensagemErro}</small> }
        <div className='flex justify-around mt-3'>
            <div>
                <Button label="Confirmar Recusa" severity="danger" icon='pi pi-check' iconPos='right' onClick={handleRecusarProfessorClick}/>
            </div>
            <div>
                <Button label="Cancelar" severity="secondary" icon='pi pi-times' iconPos='right' onClick={ () => onSetVisibility(false) } />
            </div>
        </div>
        </>)
}
        