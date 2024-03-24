import React from 'react';
import Image from 'next/image';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const AuthPage = () => {

    const router = useRouter();

    const handleClick = () => {
        toast.loading('Autenticando...', { duration: 500 });
        router.push('/submeter-proposta');
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
                <Button onClick={handleClick} label="Entrar com o Google" icon="pi pi-google" className="p-button-raised p-button-rounded p-button-lg p-m-2" />
            </div>
        </div>
    </div>;
}

AuthPage.showMenu = false;
AuthPage.logged = false;

export default AuthPage;