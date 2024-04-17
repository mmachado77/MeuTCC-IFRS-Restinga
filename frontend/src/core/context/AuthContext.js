import AuthService from "meutcc/services/AuthService";
import { useRouter } from "next/router";
import React from "react";

const AuthContext = React.createContext({
    user: null,
});

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children, guards }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const router = useRouter();

    React.useEffect(() => {
        const fetchUsuario = async () => {
            const accessToken = localStorage.getItem('token');

            if (guards && guards.length > 0 && !accessToken) {
                router.push('/auth');
            }

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const data = await AuthService.detalhesUsuario();

                if('cadastroIncompleto' in data) {
                    debugger
                    setLoading(false);
                    if(router.pathname !== '/cadastro') {
                        router.push('/cadastro')
                    }
                    return;
                }
                setUser(data);

                if (guards && guards.length > 0 && !guards.includes(data.resourcetype)) {
                    router.push('/acesso-proibido');
                    return;
                }

            } catch (error) {
                setUser(null);
                localStorage.removeItem('token');
                if (guards && guards.length > 0 && router.pathname !== '/auth') {
                    router.push('/auth');
                }
                console.error(error);
            }
            
            setLoading(false);

        }
        
        fetchUsuario();
        
    }, []);

    const value = {
        user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const handleUserLogout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
}