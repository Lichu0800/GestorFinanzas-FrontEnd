import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simulación de autenticación - En un caso real, aquí harías la llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (username === 'admin' && password === 'password') {
            const mockUser: User = {
                id: '1',
                username: 'admin',
                email: 'admin@example.com'
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Recuperar usuario del localStorage al cargar
    useState(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    });

    const value: AuthContextType = {
        user,
        login,
        logout,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};