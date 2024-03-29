import AuthService from "meutcc/services/AuthService";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const AuthContext = React.createContext();

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const router = useRouter();

    React.useEffect(() => {
        const fetchUsuario = async () => {
            const accessToken = localStorage.getItem('token');

            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const data = await AuthService.detalhesUsuario();
                setUser(data);
            } catch (error) {
                setUser(null);
                localStorage.removeItem('token');
                if (router.pathname !== '/auth') {
                    router.push('/auth');
                }
                console.error(error);
            } finally {
                setLoading(false);
            }

        }

        fetchUsuario();
    }, []);

    const value = {
        user,
        setUser,
        loading,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}