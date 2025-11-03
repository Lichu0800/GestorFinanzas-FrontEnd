import { ServerOff, RefreshCw } from 'lucide-react';

interface BackendUnavailableProps {
    onRetry?: () => void;
}

const BackendUnavailable = ({ onRetry }: BackendUnavailableProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-rose-100 p-4 rounded-full">
                            <ServerOff className="h-12 w-12 text-rose-600" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Backend No Disponible
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                        No se pudo conectar con el servidor. Por favor, verifica que:
                    </p>
                    
                    <ul className="text-left space-y-2 mb-6 text-sm text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>El servidor backend esté en funcionamiento</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>La dirección IP y puerto sean correctos (192.168.0.214:8080)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Tu conexión de red esté activa</span>
                        </li>
                    </ul>
                    
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                        >
                            <RefreshCw className="h-5 w-5" />
                            <span>Reintentar Conexión</span>
                        </button>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-6">
                        Tu sesión se cerró por seguridad. Vuelve a iniciar sesión cuando el servidor esté disponible.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BackendUnavailable;
