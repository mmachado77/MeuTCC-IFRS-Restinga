import { useAuth, handleUserLogout } from "meutcc/core/context/AuthContext";
import React, { useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { Menu } from "primereact/menu";
import { Badge } from 'primereact/badge';
import { formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import NotificacoesService from "meutcc/services/NotificacoesService";
import CustomAvatar from "./CustomAvatar";
import SearchService from 'meutcc/services/SearchService';

const NavBar = ({ auth = false, notifications, unreadCount }) => {
    const { user } = useAuth();
    const menuRight = useRef(null);
    const menuNotify = useRef(null);
    const [visibleUnreadBadge, setVisibleUnreadBadge] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/search?q=${searchQuery}`);
    };

    const handleNotificationClick = (notification) => {
        window.location.href = notification.description;
    };

    const fetchSuggestions = async (query) => {
        if (query.length > 2) {
            try {
                const response = await SearchService.search(query);
                setSuggestions(response);
            } catch (error) {
                console.error("Erro ao buscar sugestões:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const menuItems = [
        {
            label: 'Notificações',
            items: notifications.slice(0, 10).map(notification => ({
                label: (
                    <div className="flex ml-4">
                        <p>{notification.verb}</p>
                        <p className='text-gray-400'>{formatDistanceToNow(new Date(notification.timestamp), { locale: ptBR })} atrás</p>
                    </div>
                ),
                icon: 'pi pi-info-circle',
                command: () => handleNotificationClick(notification)
            }))
        }
    ];

    const items = [
        {
            label: 'Perfil',
            items: [
                {
                    label: 'Meu Perfil',
                    icon: 'pi pi-user',
                    command: () => window.location.href = `/perfil/${user.id}`
                },
                {
                    label: 'Configurações',
                    icon: 'pi pi-cog'
                },
                {
                    label: 'Sair',
                    icon: 'pi pi-sign-out',
                    command: () => handleUserLogout()
                }
            ]
        }
    ];

    const menuAuth = () => (
        <>
            <div className='px-3'>Bem vindo, <b>{user?.nome || 'Usuário'}</b></div>
            <div className='px-2'>
                <CustomAvatar image={user?.avatar} fullname={user?.nome} className='w-[40px] h-[40px] text-[20px]' shape="circle" onClick={(event) => menuRight.current.toggle(event)} />
                <Menu model={items} popup ref={menuRight} className='absolute z-50' popupAlignment="right" />
            </div>
            <div style={{ position: 'relative', alignItems: 'center', marginLeft: '10px' }}>
                <div onClick={async (event) => { menuNotify.current.toggle(event); await NotificacoesService.limparNotificacoes(); setVisibleUnreadBadge(false) }} style={{ textAlign: "center", cursor: "pointer", width: "45px", position: 'relative' }}>
                    <i className="text-gray-200 pi pi-bell p-overlay-badge" style={{ fontSize: '1.5rem' }}>
                        {unreadCount !== 0 && visibleUnreadBadge && (
                            <Badge value={unreadCount} severity="danger"></Badge>
                        )}
                    </i>
                    <Menu model={menuItems} popup ref={menuNotify} popupAlignment="left" style={{ width: '20%' }} />
                </div>
            </div>
        </>
    );

    const menuNotAuth = () => (
        <>
            <div className='px-3'>Você ainda não se identificou</div>
            <div className='px-2'>
                <Link href="/auth" className="flex p-2 font-bold border-2 border-solid rounded anchor-link align-center border-black/30">
                    <span>Acessar</span>
                    <span className='p-icon pi pi-fw pi-sign-in ms-2'></span>
                </Link>
            </div>
        </>
    );

    return (
        <div style={{ backgroundColor: '#2f9e41' }}>
            <div className='flex items-center justify-between max-w-screen-lg p-3 mx-auto'>
                <Link href="/">
                    <Image
                        src="/ifrs.png"
                        alt="IFRS Logo"
                        className="dark:invert"
                        height={40}
                        width={151}
                    />
                </Link>

                <form onSubmit={handleSearch} className="relative flex items-center mx-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            fetchSuggestions(e.target.value);
                        }}
                        placeholder="Pesquisar..."
                        className="border p-2 rounded-md bg-white text-black"
                        style={{ width: '400px' }}
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions-container">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => {
                                        setSearchQuery(suggestion.label);
                                        setSuggestions([]);
                                        handleSearch(event);
                                    }}
                                >
                                    {suggestion.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>

                <div className='flex items-center justify-around text-white'>
                    {auth ? menuAuth() : menuNotAuth()}
                </div>
            </div>
            <style jsx>{`
                .suggestions-container {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background-color: white;
                    border: 1px solid #ccc;
                    border-top: none;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    width: 100%;
                }
                .suggestion-item {
                    padding: 10px;
                    cursor: pointer;
                }
                .suggestion-item:hover {
                    background-color: #f0f0f0;
                }
            `}</style>
        </div>
    );
}

export default NavBar;
