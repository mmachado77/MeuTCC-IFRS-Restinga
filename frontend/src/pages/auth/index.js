import React from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import AuthService from 'meutcc/services/AuthService';

const AuthPage = () => {

    const router = useRouter();

    const handleLoginClick = async () => {
        try {
            const data = await toast.promise(AuthService.autenticar({ username: 'estudante@gmail.com' }), {
                loading: 'Conectando...',
                success: 'Conectado!',
                error: 'Erro ao conectar',
            });
            localStorage.setItem('token', data.token);
            router.push('/submeter-proposta');
        } catch (error) {
            console.error(error);
        }
    }

    return <div className='max-w-screen-lg mx-auto bg-white m-3 mt-6 flex flex-col'>
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
                <Button onClick={handleLoginClick} label="Entrar com o Google" icon="pi pi-google" className="p-button-raised p-button-rounded p-button-lg p-m-2" />
            </div>
        </div>
    </div>;
}

AuthPage.showMenu = false;
AuthPage.logged = false;

export default AuthPage;