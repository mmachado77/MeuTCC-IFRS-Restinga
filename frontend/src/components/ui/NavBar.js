import { useAuth, handleUserLogout } from "meutcc/core/context/AuthContext";
import React, { useRef, useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Menu } from "primereact/menu";
import { Badge } from 'primereact/badge';
import { formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import NotificacoesService from "meutcc/services/NotificacoesService";


const NavBar = ({ auth = false, notifications, unreadCount}) => {

    const { user } = useAuth();
    const menuRight = useRef(null);
    const menuNotify = useRef(null);
    const [visibleUnreadBadge, setVisibleUnreadBadge] = useState(true);

    const handleNotificationClick = (notification) => {
        window.location.href = notification.description;
      };

    const menuItems = [
      {
        label: 'Notificações',
        items: notifications.slice(0,10).map(notification => ({
              label: (
                  <div class="flex ml-4">
                    <p>{notification.verb}</p>
                    <p class='text-gray-400'>{formatDistanceToNow(new Date(notification.timestamp), { locale: ptBR })} atrás</p>
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
                <div className="p-avatar p-component p-avatar-image p-avatar-circle cursor-pointer" style={{ height: "40px", width: "40px" }} onClick={(event) => menuRight.current.toggle(event)} >
                    {user?.avatar ?
                        <img alt="avatar" className="rounded-full hover:brightness-90" referrerpolicy="no-referrer" height="40" width="40" src={user.avatar} data-pc-section="image" element-id="348" />
                        : <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                            <span class="font-medium text-gray-600 dark:text-gray-300">{user?.nome.split(' ').slice(0, 2).map(palavra => palavra[0]).join('')}</span>
                        </div>
                    }
                </div>
                <Menu model={items} popup ref={menuRight} className='absolute z-50' popupAlignment="right" />
            </div>
            <div style={{ position: 'relative', alignItems: 'center', marginLeft: '10px'}}>
              <div onClick={async (event) => {menuNotify.current.toggle(event);await NotificacoesService.limparNotificacoes(); setVisibleUnreadBadge(false)}} style={{ cursor: "pointer", height: "20px", width: "45px", position: 'relative'}}>
                <i className="pi pi-bell" style={{ fontSize: '1.7rem' }}></i>
                {unreadCount !== 0 && visibleUnreadBadge && (
                    <Badge value={String(unreadCount)} style={{ position: 'absolute', top: '-10px', right: '8px', backgroundColor:'red'}}></Badge>
                  )}
                <Menu model={menuItems} popup ref={menuNotify} popupAlignment="left" style={{ width:'20%'}}/>
              </div>
            </div>
        </>
    );

    const menuNotAuth = () => (
        <>
            <div className='px-3'>Você ainda não se identificou</div>
            <div className='px-2'>
                <Link href="/auth" className="anchor-link font-bold flex align-center p-2 border-2 border-solid rounded border-black/30">
                    <span>Acessar</span>
                    <span className='p-icon pi pi-fw pi-sign-in ms-2'></span>
                </Link>
            </div>
        </>
    );

    return (
        <div style={{ backgroundColor: '#2f9e41' }}>
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

                <div className='flex justify-around text-white items-center'>
                    {auth ? menuAuth() : menuNotAuth()}
                </div>
            </div>
        </div>
    );
}

export default NavBar;