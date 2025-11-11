import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, DollarSign, PanelLeft } from 'lucide-react';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
    const { user, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 shadow-lg">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button
                            onClick={onMenuToggle}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white/90 hover:text-white hover:bg-white/10 focus:outline-none transition-colors mr-3"
                            title="Abrir navegación lateral"
                        >
                            <PanelLeft className="h-4 w-4" />
                        </button>
                        
                        <div className="flex-shrink-0 flex items-center">
                            <DollarSign className="h-8 w-8 text-white" />
                            <h1 className="ml-2 text-xl font-bold text-white">
                                Gestor de Finanzas
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                            <User className="h-5 w-5 text-white" />
                            <span className="text-sm font-medium text-white">
                                {user?.username}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="inline-flex items-center px-4 py-2 border border-white/20 text-sm leading-4 font-medium rounded-lg text-white hover:bg-white/10 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                        >
                            <LogOut className="h-4 w-4" />
                            {isLoggingOut && <span className="ml-1 text-xs">...</span>}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;