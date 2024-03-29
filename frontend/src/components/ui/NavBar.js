import { useAuth, handleUserLogout } from "meutcc/core/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const NavBar = ({ auth = false }) => {

    const { user } = useAuth();

    const menuAuth = () => (
        <>
            <div className='px-3'><span className='pi pi-fw pi-user me-2'></span> Bem vindo, <b>{user?.nome || 'Usuário'}</b></div>
            <div className='px-2'>
                <Link href='/#logout' onClick={handleUserLogout}>Sair</Link>
            </div>
        </>
    );

    const menuNotAuth = () => (
        <>
            <div className='px-3'>Você ainda não se identificou</div>
            <div className='px-2'>
                <Link href="/auth">Acessar</Link>
            </div>
        </>
    );

    return (
        <div style={{backgroundColor: '#2f9e41'}}>
            <div className='max-w-screen-lg mx-auto flex justify-between items-center p-3'>
                <Link href="/">
                    <Image
                    src="/ifrs.png"
                    alt="IFRS Logo"
                    className="dark:invert"
                    height={40}
                    width={151}
                    />
                </Link>

                <div className='flex justify-around text-white'>
                    { auth ? menuAuth() : menuNotAuth() }
                </div>
            </div>
        </div>        
    );
}

export default NavBar;