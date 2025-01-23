import React from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import AuthService from 'meutcc/services/AuthService';
import { GUARDS } from 'meutcc/core/constants';
import { useAuth } from 'meutcc/core/context/AuthContext';

const DashboardSuperAdmin = () => {
    const router = useRouter();
    const { user } = useAuth(); // Obtém o usuário autenticado

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 px-4">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* Card Gerenciar Cursos */}
                <Card
                    title="Gerenciar Cursos"
                    subTitle="Adicione, edite ou remova cursos"
                    className="hover:shadow-lg transition-shadow"
                >
                    <Button
                        label="Acessar"
                        icon="pi pi-arrow-right"
                        className="p-button-outlined p-button-info"
                        onClick={() => router.push('/superadmin/cursos')}
                    />
                </Card>

                {/* Card Gerenciar Coordenadores (visível apenas para SuperAdmin) */}
                {user?.resourcetype === 'SuperAdmin' && (
                    <Card
                        title="Gerenciar Coordenadores"
                        subTitle="Gerencie os coordenadores por curso"
                        className="hover:shadow-lg transition-shadow"
                    >
                        <Button
                            label="Acessar"
                            icon="pi pi-arrow-right"
                            className="p-button-outlined p-button-warning"
                            onClick={() => router.push('/superadmin/coordenadores')}
                        />
                    </Card>
                )}
            </div>

        </div>
    );
};

DashboardSuperAdmin.guards = [GUARDS.COORDENADOR, GUARDS.SUPERADMIN];
DashboardSuperAdmin.title = 'Gerenciamento do Sistema';
export default DashboardSuperAdmin;
