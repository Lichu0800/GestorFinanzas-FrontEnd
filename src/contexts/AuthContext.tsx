import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, RegisterCredentials, UserBalance } from '../types';
import authService from '../services/authService';
import balanceService from '../services/balanceService';

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
    const [balance, setBalance] = useState<UserBalance | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadBalance = async () => {
        try {
            const response = await balanceService.getMyBalance();
            
            if (response.success && response.data) {
                setBalance(response.data);
            }
        } catch (error) {
            console.error('Error loading balance:', error);
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        try {
            const response = await authService.login({ username, password });
            
            if (response.success && response.data.status && response.data.jwt) {
                const userData: User = {
                    id: '1', // Valor por defecto ya que no viene en la respuesta
                    username: response.data.username,
                    email: '' // Valor por defecto ya que no viene en la respuesta
                };
                setUser(userData);
                
                // Cargar balance después del login exitoso
                await loadBalance();
                
                setIsLoading(false);
                return true;
            }
            
            setIsLoading(false);
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            setIsLoading(false);
            return false;
        }
    };

    const logout = async () => {
        try {
            const result = await authService.logout();
            console.log('Logout result:', result.message);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setBalance(null);
        }
    };

    const refreshBalance = async () => {
        await loadBalance();
    };

    const register = async (registerData: RegisterCredentials): Promise<{ success: boolean; message?: string }> => {
        setIsLoading(true);
        
        try {
            const response = await authService.register(registerData);
            setIsLoading(false);
            
            if (response.success) {
                return { success: true, message: 'Usuario registrado exitosamente' };
            } else {
                return { success: false, message: response.error || 'Error al registrar usuario' };
            }
        } catch (error: any) {
            setIsLoading(false);
            return { success: false, message: error.message || 'Error al registrar usuario' };
        }
    };

    // Recuperar usuario del localStorage al cargar
    useEffect(() => {
        const userData = authService.getUserData();
        if (userData && authService.isAuthenticated()) {
            const user: User = {
                id: userData.id,
                username: userData.username,
                email: userData.email || ''
            };
            setUser(user);
            // Cargar balance si el usuario está autenticado
            loadBalance();
        }
    }, []);

    const value: AuthContextType = {
        user,
        balance,
        login,
        logout,
        register,
        refreshBalance,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};