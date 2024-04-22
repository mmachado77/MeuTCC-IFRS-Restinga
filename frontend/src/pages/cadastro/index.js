import React, { useState, useEffect } from 'react';
import DadosPessoaisStep from './DadosPessoaisStep';
import TipoCadastroStep from './TipoCadastro';
import DetalhesAdicionaisStep from './DetalhesAdicionaisStep';
import UsuarioService from 'meutcc/services/UsuarioService';
import { useRouter } from 'next/router';


const CadastroPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const [isUserExists, setIsUserExists] = useState(false);
    const [userData, setUserData] = useState({
        nome: '',
        cpf: '',
        matricula: '',
        area: '',
        grau: '',
        titulo: '',
        identidade: null,
        diploma: null,
        isProfessor: false,
        IsInterno: false,
        avatar: ''
    });

    React.useEffect(() => {
        const token = localStorage.getItem('data');
        if (token) {
            const decodedData = JSON.parse(atob(token));
            const { name, email, picture } = decodedData;
            setUserData({
                ...userData,
                nome: name,
                email: email,
                IsInterno: email.endsWith('@restinga.ifrs.edu.br') || email.endsWith('@aluno.restinga.ifrs.edu.br'),
                avatar: picture
            });
        }

    }, []);

    const nextStep = () => {
        if (activeIndex === 0) {
            setActiveIndex(userData.IsInterno ? 1 : 2);
        } else {
            setActiveIndex(activeIndex + 1);
        }
    };

    const submitCadastro = async () => {
        console.log('Dados enviados:', userData);
        await UsuarioService.criarUsuario(userData);
    };


    const steps = [
        { label: 'Dados Pessoais' },
        { label: 'Escolha o Tipo' },
        { label: 'Detalhes Adicionais' }
    ];

    return (
        <div>
            {activeIndex === 0 && <DadosPessoaisStep userData={userData} setUserData={setUserData} nome={userData.nome} email={userData.email} activeIndex={activeIndex} setActiveIndex={setActiveIndex} nextStep={nextStep} />}
            {activeIndex === 1 && <TipoCadastroStep onTipoCadastroChange={(tipo) => setUserData({ ...userData, isProfessor: tipo })} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />}
            {activeIndex === 2 && <DetalhesAdicionaisStep IsInterno={userData.IsInterno} userData={userData} setUserData={setUserData} grausAcademicos={[
                { label: 'Técnico', value: 'TECNICO' },
                { label: 'Graduação', value: 'GRADUACAO' },
                { label: 'Pós-Graduação', value: 'POSGRADUACAO' },
                { label: 'Mestrado', value: 'MESTRADO' },
                { label: 'Doutorado', value: 'DOUTORADO' },
                { label: 'Pós-Doutorado', value: 'POSD' }
            ]} submitCadastro={submitCadastro} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />}
        </div>

    );
};

CadastroPage.title = 'Cadastro de Usuários';
export default CadastroPage;
