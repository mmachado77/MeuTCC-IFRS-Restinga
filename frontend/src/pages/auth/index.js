import React from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import AuthService from 'meutcc/services/AuthService';
import { Dropdown } from 'primereact/dropdown';
import UsuarioService from 'meutcc/services/UsuarioService';
import { handleApiResponse } from 'meutcc/core/utils/apiResponseHandler';

const AuthPage = () => {
    const [username, setUsername] = React.useState('');
    const [usuarios, setUsuarios] = React.useState([]);

    const handleLoginClick = async () => {
        try {
            const data = await toast.promise(AuthService.autenticar({ username: username.code }), {
                loading: 'Conectando...',
                success: 'Conectado!',
                error: 'Erro ao conectar',
            });
            localStorage.setItem('token', data.token);
            //window.location.href = ('/submeter-proposta');
            window.location.href = ('/home');
        } catch (error) {
            handleApiResponse(error.response);
            console.error(error);
        }
    }

    const handleLoginClick2 = () => {
        window.location.href = 'http://localhost:8000/auth-google';
    }

    const fetchAuthCallback = async () => {
        const urlParams = window.location.search;
        const params = new URLSearchParams(urlParams);
        const token = params.get('token');
        if (!token) return;
        const data = params.get('data');
        localStorage.setItem('token', token);
        localStorage.setItem('data', data);
        window.location.href = ('/submeter-proposta');
    }

    const fetchUsuarios = async () => {
        try {
            const { data } = await UsuarioService.listarUsuarios();
            setUsuarios(data.map((usuario) => ({ name: `${usuario.nome} (${usuario.resourcetype})`, code: usuario.email })));
        } catch (error) {
            handleApiResponse(error.response);
            console.error(error);
        }
    };

    React.useEffect(() => {
        fetchAuthCallback();
        fetchUsuarios();
    }, []);

    return <>
        <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
            <div className='flex flex-wrap align-items-center justify-around items-center py-10'>
                <div>
                    <Image
                        src="/ifrs_colorido.svg"
                        alt="IFRS Logo"
                        height={100}
                        width={400}
                    />
                </div>
                <div>               
                    <Button onClick={handleLoginClick2} label="Entrar com o Google" icon="pi pi-google" className="p-button-raised p-button-rounded p-button-lg p-m-2" />
                </div>
            </div>
        </div>
        <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
            <h1 className='text-2xl font-bold px-6 py-2'>
                Selecione a conta de usuário
            </h1>
            <div className='flex flex-row justify-around p-5 gap-5'>
                <Dropdown value={username} onChange={(e) => setUsername(e.value)} options={usuarios} optionLabel="name" 
                    placeholder="Selecione a conta" className="w-1/2 md:w-14rem" />
                <Button onClick={handleLoginClick} label="Entrar" icon="pi pi-signup" className="w-1/2 p-button-raised p-button-rounded p-button-lg p-m-2" />
            </div>            
        </div>
    </>;
}

AuthPage.title = 'Autenticação';

export default AuthPage;