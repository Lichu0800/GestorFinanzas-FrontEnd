import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, DollarSign, Menu } from 'lucide-react';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <DollarSign className="h-8 w-8 text-indigo-600" />
                            <h1 className="ml-2 text-xl font-bold text-gray-900">
                                Gestor de Finanzas
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {user?.username}
                            </span>
                        </div>

                        <button
                            onClick={onMenuToggle}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                            title="Abrir menú"
                        >
                            <Menu className="h-4 w-4" />
                        </button>

                        <button
                            onClick={logout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;