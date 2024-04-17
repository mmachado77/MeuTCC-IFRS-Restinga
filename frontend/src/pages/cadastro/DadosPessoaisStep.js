import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { InputMask } from 'primereact/inputmask';


const DadosPessoaisStep = ({ userData, setUserData, nome, email, activeIndex, setActiveIndex, nextStep }) => {
    const toast = React.useRef(null);
    const [errors, setErrors] = useState({});
    const onCPFChange = (e) => {
        const cpf = e.target.value.replace(/\D/g, '');  // Remove non-digits
        if (cpf.length <= 11) {
            setUserData({ ...userData, cpf });
        }
    };

    function validateCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não dígitos
        if (cpf.length !== 11) {
            return false;
        }
    
        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
    
        let sum = 0;
        let remainder;
    
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
    
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
    
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
        return true;
    }    

    const onNomeChange = (e) => {
        const nome = e.target.value.replace(/[^a-zA-Z\s]/g, '');  // Remove special characters
        setUserData({ ...userData, nome });
    };

    const validateAndProceed = () => {
        const errors = {};

        if (!userData.nome) {
            errors.nome = 'Nome é obrigatório';
        }
        if (!validateCPF(userData.cpf)) {
            errors.cpf = 'CPF inválido';
            toast.current.show({ severity: 'error', summary: 'Erro no CPF', detail: 'CPF inválido', life: 3000 });
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        nextStep();
    };

    const steps = [
        { label: 'Dados Pessoais' },
        { label: 'Escolha o Tipo' },
        { label: 'Detalhes Adicionais' }
    ];

    return (
        <div className='py-6 px-9'>
            <Toast ref={toast} />
            <div className='max-w-screen-md mx-auto bg-white m-3 mt-6 flex flex-col py-6 px-9'>
                <div className='py-3 border-0 border-b border-dashed border-gray-200'>
                    <Steps model={steps} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
                    <h1 className='heading-1 text-center text-gray-700'>Dados do Usuário</h1>
                </div>
                <InputText className='w-full mb-2' value={nome} onChange={onNomeChange} />
                <InputMask className='w-full mb-2' unmask={true} value={userData.cpf} onChange={(e) => setUserData({ ...userData, cpf: e.target.value })} mask="999.999.999-99" placeholder="CPF" />
                <InputText className='w-full mb-2' value={email} readOnly />
                <Button label="Próximo" onClick={validateAndProceed} />
            </div>
        </div>
    );
};

export default DadosPessoaisStep;
