import { Menubar } from "primereact/menubar";
import NavBar from "../ui/NavBar";
import { Toaster } from "react-hot-toast";
import { GUARDS } from "meutcc/core/constants";
import { useAuth } from "meutcc/core/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import ConfiguracoesService from "meutcc/services/ConfiguracoesService";
import React, { useState } from "react";

export const AppLayout = ({ children, guards }) => {

    const { user } = useAuth();
    const [coordenadorNome, setCoordenadorNome] = useState('');

    const menuItemTemplate = (item) => {
        return <Link href={ item.url } className="p-menuitem-link" aria-hidden="true">
            <span className={'p-menuitem-icon ' + item.icon || ''}></span>
            <span className="p-menuitem-text">{ item.label }</span>
        </Link>;
    
    };

    const typesMenu = {
        Todos: [
            { label: 'Inicio', icon: 'pi pi-fw pi-home', url: '/', },
            { label: 'Meus TCCs', icon: 'pi pi-fw pi-book', url: '/meus-tccs' },
        ],
        Estudante: [
        ],
        Coordenador: [
            { label: 'Atualizar Permissões', icon: 'pi pi-fw pi-users', url: '/atualizar-permissoes' },    
            { label: 'Proposta Pendente', icon: 'pi pi-fw pi-thumbs-up', url: '/proposta-pendente' },    
            { label: 'Configurações', icon: 'pi pi-fw pi-cog', url: '/painel-configuracoes' },
        ],
        Professor: [
            { label: 'Proposta Pendente', icon: 'pi pi-fw pi-thumbs-up', url: '/proposta-pendente' },    
        ],
        ProfessorInterno: [],
        ProfessorExterno: [],
    };
    const items = typesMenu.Todos.concat(['ProfessorInterno', 'ProfessorExterno'].includes(user?.resourcetype) ? typesMenu.Professor : []).concat(typesMenu[user?.resourcetype] || []).map((item) => ({ ...item, template: menuItemTemplate }));

    const isUserAuth = !!user || false;

    const fetchConfigs = async () => {
        try {
            const data = await ConfiguracoesService.getCoordenador();
            setCoordenadorNome(data.coordenador);
        } catch (error) {
            console.error('Erro ao buscar as configurações', error);
        }
    };

    React.useEffect(() => {
        fetchConfigs();
    }, [])

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <NavBar auth={isUserAuth} />

            <div style={{backgroundColor: '#f9fafb'}}>
                {
                    isUserAuth &&
                    <Menubar model={items} style={{borderWidth: 0}} className='max-w-screen-lg mx-auto' />
                    ||
                    <div>
                        <div className='max-w-screen-lg mx-auto text-gray-600 text-2xl p-6 ps-10'>Meu TCC IFRS Campus Restinga</div>
                    </div>
                }
            </div>

            <div style={{minHeight: '500px'}}>
                {children}
            </div>

            <footer className='bg-green-900 text-white text-center py-9 mt-10'>
                <p>Instituto Federal do Rio Grande do Sul – Campus Restinga</p>
                <p>Rua Alberto Hoffmann, 285 | Bairro Restinga | CEP: 91791-508 | Porto Alegre/RS</p>
                <p>Créditos do site:</p>
                <p>Alunos: Bruno Padilha, Carlos Eduardo, Carlos Rafael, Cid Monza, Matheus Machado, Matheus Costa Krenn</p>
                <p>Professores: Ricardo dos Santos, Eliana Pereira</p>
                <p>Coordenador: { coordenadorNome } - ads@restinga.ifrs.edu.br</p>
            </footer>
        </div>
    );
};