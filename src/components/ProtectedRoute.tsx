import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BackendUnavailable from './BackendUnavailable';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading, backendUnavailable, retryConnection } = useAuth();

    // Mostrar loading mientras se valida la sesión
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 font-medium">Validando sesión...</p>
                </div>
            </div>
        );
    }

    // Mostrar componente de backend no disponible si corresponde
    if (backendUnavailable && !user) {
        return <BackendUnavailable onRetry={retryConnection} />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;