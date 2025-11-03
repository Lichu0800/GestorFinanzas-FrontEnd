import { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Filter, Download, Settings } from 'lucide-react';

interface AddButtonMenuProps {
    className?: string;
}

const AddButtonMenu = ({ className = '' }: AddButtonMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    const quickActions = [
        {
            id: 'add-transaction',
            title: 'Agregar Transacción',
            icon: <Plus className="h-5 w-5" />,
            description: 'Registra un nuevo ingreso o gasto',
            color: 'bg-blue-500 hover:bg-blue-600'
        },
        {
            id: 'add-income',
            title: 'Agregar Ingreso',
            icon: <TrendingUp className="h-5 w-5" />,
            description: 'Registra un nuevo ingreso',
            color: 'bg-green-500 hover:bg-green-600'
        },
        {
            id: 'add-expense',
            title: 'Agregar Gasto',
            icon: <TrendingDown className="h-5 w-5" />,
            description: 'Registra un nuevo gasto',
            color: 'bg-red-500 hover:bg-red-600'
        },
        {
            id: 'filters',
            title: 'Filtros Avanzados',
            icon: <Filter className="h-5 w-5" />,
            description: 'Filtra transacciones por criterios',
            color: 'bg-purple-500 hover:bg-purple-600'
        },
        {
            id: 'export',
            title: 'Exportar Datos',
            icon: <Download className="h-5 w-5" />,
            description: 'Descarga tu información financiera',
            color: 'bg-orange-500 hover:bg-orange-600'
        },
        {
            id: 'quick-settings',
            title: 'Configuración Rápida',
            icon: <Settings className="h-5 w-5" />,
            description: 'Ajustes rápidos de la aplicación',
            color: 'bg-gray-500 hover:bg-gray-600'
        }
    ];

    const handleActionClick = (actionId: string) => {
        setActiveSection(activeSection === actionId ? '' : actionId);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setActiveSection('');
        }
    };

    return (
        <>
            {/* Backdrop cuando está abierto */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 transition-opacity z-40"
                    onClick={toggleMenu}
                />
            )}

            <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
                {/* Panel desplegable */}
                <div
                    className={`absolute bottom-16 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300 ease-in-out ${
                        isOpen
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                    }`}
                >
                    {/* Header del panel */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
                                <p className="text-sm text-gray-500">Agrega datos o configura filtros</p>
                            </div>
                            <button
                                onClick={toggleMenu}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Contenido del panel */}
                    <div className="p-4 max-h-96 overflow-y-auto">
                        <div className="space-y-2">
                            {quickActions.map((action) => (
                                <div key={action.id}>
                                    <button
                                        onClick={() => handleActionClick(action.id)}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                                            activeSection === action.id
                                                ? 'bg-gray-50 border-2 border-gray-200'
                                                : 'hover:bg-gray-50 border-2 border-transparent'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg text-white ${action.color}`}>
                                            {action.icon}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
                                            <p className="text-xs text-gray-500">{action.description}</p>
                                        </div>
                                    </button>

                                    {/* Contenido expandido */}
                                    {activeSection === action.id && (
                                        <div className="mt-2 ml-4 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-200">
                                            {renderActionContent(action.id)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Botón flotante principal */}
                <button
                    onClick={toggleMenu}
                    className={`w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out flex items-center justify-center ${
                        isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
                    }`}
                >
                    <Plus className="h-6 w-6" />
                </button>
            </div>
        </>
    );
};

// Contenido de cada acción (reutilizando la lógica del SideMenu original)
const renderActionContent = (actionId: string) => {
    switch (actionId) {
        case 'add-transaction':
        case 'add-income':
        case 'add-expense':
            return (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ej: Compra de supermercado"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Monto
                            </label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Fecha
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    {actionId === 'add-transaction' && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="income">Ingreso</option>
                                <option value="expense">Gasto</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Seleccionar categoría</option>
                            <option value="alimentacion">Alimentación</option>
                            <option value="transporte">Transporte</option>
                            <option value="servicios">Servicios</option>
                            <option value="entretenimiento">Entretenimiento</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
                        Agregar {actionId === 'add-income' ? 'Ingreso' : actionId === 'add-expense' ? 'Gasto' : 'Transacción'}
                    </button>
                </div>
            );

        case 'filters':
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Desde
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Hasta
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="">Todas</option>
                                <option value="alimentacion">Alimentación</option>
                                <option value="transporte">Transporte</option>
                                <option value="servicios">Servicios</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option value="">Todos</option>
                                <option value="income">Ingresos</option>
                                <option value="expense">Gastos</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
                            Aplicar
                        </button>
                        <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                            Limpiar
                        </button>
                    </div>
                </div>
            );

        case 'export':
            return (
                <div className="space-y-2">
                    <p className="text-xs text-gray-600 mb-3">
                        Exporta tus datos financieros
                    </p>
                    
                    <button className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Excel</span>
                    </button>

                    <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                    </button>
                </div>
            );

        case 'quick-settings':
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">Notificaciones</span>
                        <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-indigo-600 transition-colors">
                            <span className="inline-block h-3 w-3 transform rounded-full bg-white transition-transform translate-x-5" />
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Moneda
                        </label>
                        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="ARS">Peso Argentino (ARS)</option>
                            <option value="USD">Dólar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                    </div>
                </div>
            );

        default:
            return (
                <div className="text-xs text-gray-500">
                    Funcionalidad próximamente disponible
                </div>
            );
    }
};

export default AddButtonMenu;