import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { GUARDS } from 'meutcc/core/constants';
import { useAuth } from 'meutcc/core/context/AuthContext';

const Dashboard = () => {
  const router = useRouter();
  const { user } = useAuth(); // Obtém o usuário autenticado

  const itemRenderer = (item) => (
    <a className="p-menuitem-link flex items-center overflow-hidden">
      {/* Parte 1 - Fundo azul, ícone e texto brancos */}
      <div className="w-2/6 bg-blue-500 text-white flex items-center border rounded-md justify-center">
        <span className={`${item.icon} text-white text-base`} />
        <p className="ml-2 text-sm font-semibold">{item.label}</p>
      </div>

      {/* Parte 2 - Fundo branco, descrição azul */}
      <div className="w-4/6 text-blue-500 flex items-center px-2 py-1">
        <p className="text-xs italic">{item.description}</p>
      </div>
    </a>
);
  const itemRendererUsuario = (item) => (
    <a className="p-menuitem-link flex items-center overflow-hidden">
      {/* Parte 1 - Fundo verde, ícone e texto brancos */}
      <div className="w-2/6 bg-green-500 text-white flex items-center border rounded-md justify-center">
        <span className={`${item.icon} text-white text-base`} />
        <p className="ml-2 text-sm font-semibold">{item.label}</p>
      </div>

      {/* Parte 2 - Fundo branco, descrição verde */}
      <div className="w-4/6 text-green-500 flex items-center px-2 py-1">
        <p className="text-xs italic">{item.description}</p>
      </div>
    </a>
  );
  const itemRendererSistema = (item) => (
    <a className="p-menuitem-link flex items-center overflow-hidden">
      {/* Parte 1 - Fundo laranja, ícone e texto brancos */}
      <div className="w-2/6 bg-orange-500 text-white flex items-center border rounded-md justify-center">
        <span className={`${item.icon} text-white text-base`} />
        <p className="ml-2 text-sm font-semibold">{item.label}</p>
      </div>
  
      {/* Parte 2 - Fundo branco, descrição laranja */}
      <div className="w-4/6 text-orange-500 flex items-center px-2 py-1">
        <p className="text-xs italic">{item.description}</p>
      </div>
    </a>
  );
  


  const menuCurso = useRef(null);
  const menuUsuario = useRef(null);
  const menuSistema = useRef(null);

  const itemsMenuSistema = [
    {
      label: 'Semestres',
      icon: 'pi pi-calendar',
      description: "Configure os Semestres do sistema de acordo com o Calendário Acadêmico.",
      template: itemRendererSistema,
      command: () => {
        router.push('/superadmin/semestres')}
    }
  ]

  const itemsMenuUsuario = [
    {
      label: 'Coordenadores',
      icon: 'pi pi-verified',
      description: "Associe contas de coordenador a um curso do sistema.",
      template: itemRendererUsuario,
      command: () => {
        router.push('/superadmin/coordenadores')}
    },
    {
      label: 'Usuários',
      icon: 'pi pi-users',
      description: "Consulte todos os usuários cadastrados no sistema.",
      template: itemRendererUsuario,
      command: () => {
        router.push('/superadmin/lista-usuarios')}
    },
    {
      label: 'Professores',
      icon: 'pi pi-user-plus',
      description: "Aprove cadastros de professores no sistema.",
      template: itemRendererUsuario,
      command: () => {
        router.push('/superadmin/professores-pendentes')}
    }
  ]

  const itemsMenuCurso =[
    {
      label: 'Adicionar',
      icon: 'pi pi-plus',
      description: "Adicione um novo curso ao sistema.",
      template: itemRenderer,
      command: () => {
        router.push('/superadmin/cursos/adicionar')}
    },
    {
      label: 'Gerenciar',
      icon: 'pi pi-cog',
      description: "Gerencia as configurações, coordenador e professores de um curso.",
      template: itemRenderer,
      command: () => {
        router.push('/superadmin/cursos')}
    },
    {
      label: 'Visibilidade',
      icon: 'pi pi-eye-slash',
      description: "Altere a visibilidade dos cursos do existentes do sistema.",
      template: itemRenderer,
      command: () => {
        router.push('/superadmin/cursos/visibilidade')}
    }
  ]
  // Renderização para SuperAdmin
  const renderSuperAdminDashboard = () => {
    return (
      <div className="max-w-screnn-lg mx-auto flex flex-col items-center justify-center bg-gray-100 pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Configurações do Sistema</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

          {/* Card Curso */}
          <div
            className="
              bg-white
              h-fit
              text-gray-800
              shadow-sm
              border
              border-gray-300
              rounded-lg
              px-4
              transition-all
              duration-200
              cursor-pointer
              hover:border-blue-800
              hover:shadow-md
              hover:shadow-blue-300
            "
            onClick={(e) => {
              menuCurso.current.toggle(e);
              setTimeout(() => {
                const focusedItem = document.querySelector('.p-menuitem.p-focus');
                if (focusedItem) {
                  focusedItem.classList.remove('p-focus');
                }
              }, 50);
            }}
          >
            <div>
              {/* Título um pouco menor para combinar com o texto do Menu */}
              <h3 className="text-2xl font-semibold text-blue-500">Editar Cursos</h3>

              {/* Texto ainda menor (text-xs), seguindo o padrão do Menu */}
              <p className="text-lg text-gray-600">
                Adicione, gerencie e altere a visibilidade de cursos do sistema.
              </p>
            </div>
          </div>
          
          {/* Card Usuários */}
          <div
            className="
              bg-white
              h-fit
              text-gray-800
              shadow-sm
              border
              border-gray-300
              rounded-lg
              px-4
              transition-all
              duration-200
              cursor-pointer
              hover:border-green-800
              hover:shadow-md
              hover:shadow-green-300
            "
            onClick={(e) => {
              menuUsuario.current.toggle(e);
              setTimeout(() => {
                const focusedItem = document.querySelector('.p-menuitem.p-focus');
                if (focusedItem) {
                  focusedItem.classList.remove('p-focus');
                }
              }, 50);
            }}
          >
            <div>
              {/* Título um pouco menor para combinar com o texto do Menu */}
              <h3 className="text-2xl font-semibold text-green-500">Editar Usuários</h3>

              {/* Texto ainda menor (text-xs), seguindo o padrão do Menu */}
              <p className="text-lg text-gray-600">
                Adicione, gerencie e altere a visibilidade de usuários do sistema.
              </p>
            </div>
          </div>

          {/* Card Sistema */}
          <div
            className="
              bg-white
              h-fit
              text-gray-800
              shadow-sm
              border
              border-gray-300
              rounded-lg
              px-4
              transition-all
              duration-200
              cursor-pointer
              hover:border-orange-800
              hover:shadow-md
              hover:shadow-orange-300
            "
            onClick={(e) => {
              menuSistema.current.toggle(e);
              setTimeout(() => {
                const focusedItem = document.querySelector('.p-menuitem.p-focus');
                if (focusedItem) {
                  focusedItem.classList.remove('p-focus');
                }
              }, 50);
            }}
          >
            <div>
              {/* Título um pouco menor para combinar com o texto do Menu */}
              <h3 className="text-2xl font-semibold text-orange-500">Editar Sistema</h3>

              {/* Texto ainda menor (text-xs), seguindo o padrão do Menu */}
              <p className="text-lg text-gray-600">
                Gerencie as configurações e parâmetros globais do sistema.
              </p>
            </div>
          </div>
          <div>
            <TieredMenu autoFocus={false} model={itemsMenuCurso} popup ref={menuCurso} breakpoint="767px" />
          </div>
          <div>
            <TieredMenu autoFocus={false} model={itemsMenuUsuario} popup ref={menuUsuario} breakpoint="767px" />
          </div>
          <div>
            <TieredMenu autoFocus={false} model={itemsMenuSistema} popup ref={menuSistema} breakpoint="767px" />
          </div>

        </div>
      </div>
    );
  };

  // Renderização para Coordenador (apenas os cards que não eram exclusivos do SuperAdmin)
  const renderCoordenadorDashboard = () => {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard - Coordenador</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Card Gerenciar Cursos */}
          <Card
            title="Gerenciar Cursos"
            subTitle="Gerencia as configurações, coordenador e professores de um curso."
            className="hover:shadow-lg transition-shadow"
          >
            <Button
              label="Acessar"
              icon="pi pi-arrow-right"
              className="p-button-outlined p-button-info"
              onClick={() => router.push('/superadmin/cursos')}
            />
          </Card>

          {/* Card Visibilidade de Curso */}
          <Card
            title="Visibilidade de Curso"
            subTitle="Altere a visibilidade dos cursos do existentes do sistema."
            className="hover:shadow-lg transition-shadow"
          >
            <Button
              label="Acessar"
              icon="pi pi-eye-slash"
              className="p-button-outlined p-button-info"
              onClick={() => router.push('/superadmin/cursos/visibilidade')}
            />
          </Card>
        </div>
      </div>
    );
  };

  // Renderiza o dashboard adequado com base no tipo de usuário
  if (user?.resourcetype === 'SuperAdmin') {
    return renderSuperAdminDashboard();
  }

  if (user?.resourcetype === 'Coordenador') {
    return renderCoordenadorDashboard();
  }

  // Caso o usuário não possua nenhum dos tipos esperados
  return <div>Acesso não autorizado.</div>;
};

Dashboard.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
Dashboard.title = 'Gerenciamento do Sistema';
export default Dashboard;
