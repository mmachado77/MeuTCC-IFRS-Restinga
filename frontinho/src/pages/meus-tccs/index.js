import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';

const MeusTccsPage = () => {

    const items = [
        { label: 'Inicio', icon: 'pi pi-fw pi-home' },
        { label: 'Meus TCCs', icon: 'pi pi-fw pi-book' },
        { label: 'Configurações', icon: 'pi pi-fw pi-cog' },
    ];

    return <div>
        <div style={{backgroundColor: '#2f9e41'}} className='flex justify-between items-center p-3'>
            <Image
              src="/ifrs.png"
              alt="IFRS Logo"
              className="dark:invert"
              height={40}
              width={151}
            />

            <div className='flex justify-around text-white'>
                <div className='px-3'> 
                    <span className='pi pi-fw pi-user me-2'></span>
                    Bem vindo, <b>Aluno</b>
                </div>
                <div className='px-2'>Sair</div>
            </div>
        </div>

        <Menubar model={items} />

        <div className='content'>
            {/* <h1>Submeter Proposta de TCC</h1>
            <hr />
            <InputText placeholder='Tema' />
            <InputTextarea placeholder='Escreva um resumo sobre o que será abordado em seu TCC' /> */}
            {/* <Dropdown placeholder='Orientador'/>
            <Dropdown placeholder='Co-orientador'/> */}

            <div className="flex flex-wrap align-items-center mb-3 gap-2">
                <label htmlFor="username" className="p-sr-only">Username</label>
                <InputText id="username" placeholder="Username" className="p-invalid mr-2" />
                <Message severity="error" text="Username is required" />
            </div>

        </div>

        
    </div>;

}

export default MeusTccsPage;