import { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Filter, Download, Settings } from 'lucide-react';
import categoryService from '../services/categoryService';
import movementService, { type CreateMovementData } from '../services/movementService';
import type { Category } from '../types';

interface AddButtonMenuProps {
    className?: string;
    onMovementCreated?: () => void;
}

const AddButtonMenu = ({ className = '', onMovementCreated }: AddButtonMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        currency: 'ARS' as 'ARS' | 'USD',
        categoryID: '',
        fecha: new Date().toISOString().split('T')[0],
    });

    // Cargar categorías cuando se abre el menú
    useEffect(() => {
        if (isOpen && categories.length === 0) {
            loadCategories();
        }
    }, [isOpen]);

    const loadCategories = async () => {
        setIsLoadingCategories(true);
        try {
            const response = await categoryService.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            } else {
                console.error('Error al cargar categorías:', response.error);
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (movementType: 'INGRESO' | 'EGRESO') => {
        // Validaciones
        if (!formData.description.trim()) {
            alert('Por favor ingresa una descripción');
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Por favor ingresa un monto válido');
            return;
        }
        if (!formData.categoryID) {
            alert('Por favor selecciona una categoría');
            return;
        }

        setIsSubmitting(true);
        try {
            const movementData: CreateMovementData = {
                description: formData.description,
                amount: parseFloat(formData.amount),
                movementType: movementType,
                currency: formData.currency,
                categoryID: parseInt(formData.categoryID),
                fecha: new Date(formData.fecha).toISOString(),
            };

            await movementService.createMovement(movementData);
            
            // Limpiar formulario
            setFormData({
                description: '',
                amount: '',
                currency: 'ARS',
                categoryID: '',
                fecha: new Date().toISOString().split('T')[0],
            });

            // Cerrar sección activa y menú
            setActiveSection('');
            
            // Notificar que se creó un movimiento
            if (onMovementCreated) {
                onMovementCreated();
            }

            alert(`${movementType === 'INGRESO' ? 'Ingreso' : 'Egreso'} registrado exitosamente`);
        } catch (error: any) {
            console.error('Error al crear movimiento:', error);
            alert(`Error al registrar el ${movementType === 'INGRESO' ? 'ingreso' : 'egreso'}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const incomeActions = [
        {
            id: 'add-income',
            title: 'Agregar Ingreso',
            icon: <TrendingUp className="h-5 w-5" />,
            description: 'Registra un nuevo ingreso',
            color: 'bg-green-500 hover:bg-green-600'
        }
    ];

    const expenseActions = [
        {
            id: 'add-expense',
            title: 'Agregar Egreso',
            icon: <TrendingDown className="h-5 w-5" />,
            description: 'Registra un nuevo gasto',
            color: 'bg-red-500 hover:bg-red-600'
        }
    ];

    const otherActions = [
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

    const renderActionContent = (actionId: string) => {
        switch (actionId) {
            case 'add-income':
            case 'add-expense':
                const isIncome = actionId === 'add-income';
                const movementType = isIncome ? 'INGRESO' : 'EGRESO';
                
                return (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
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
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Moneda
                                </label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="ARS">ARS (Peso)</option>
                                    <option value="USD">USD (Dólar)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Fecha
                            </label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <select
                                name="categoryID"
                                value={formData.categoryID}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                disabled={isLoadingCategories}
                            >
                                <option value="">
                                    {isLoadingCategories ? 'Cargando categorías...' : 'Seleccionar categoría'}
                                </option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.emoji ? `${category.emoji} ` : ''}{category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button 
                            onClick={() => handleSubmit(movementType)}
                            disabled={isSubmitting}
                            className={`w-full ${
                                isIncome 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-red-600 hover:bg-red-700'
                            } text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isSubmitting ? 'Guardando...' : `Agregar ${isIncome ? 'Ingreso' : 'Egreso'}`}
                        </button>
                    </div>
                );

            case 'filters':
                return (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-600">Función de filtros en desarrollo</p>
                    </div>
                );

            case 'export':
                return (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-600">Función de exportación en desarrollo</p>
                    </div>
                );

            case 'quick-settings':
                return (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-600">Configuración rápida en desarrollo</p>
                    </div>
                );

            default:
                return null;
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
                        {/* Sección de Ingresos */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-gray-900">Ingresos</h3>
                            </div>
                            <div className="space-y-2">
                                {incomeActions.map((action) => (
                                    <div key={action.id}>
                                        <button
                                            onClick={() => handleActionClick(action.id)}
                                            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                                                activeSection === action.id
                                                    ? 'bg-green-50 border-2 border-green-200'
                                                    : 'hover:bg-green-50 border-2 border-transparent'
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
                                            <div className="mt-2 ml-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-300">
                                                {renderActionContent(action.id)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="border-t border-gray-200 mb-6"></div>

                        {/* Sección de Egresos */}
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                                <h3 className="font-semibold text-gray-900">Egresos</h3>
                            </div>
                            <div className="space-y-2">
                                {expenseActions.map((action) => (
                                    <div key={action.id}>
                                        <button
                                            onClick={() => handleActionClick(action.id)}
                                            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                                                activeSection === action.id
                                                    ? 'bg-red-50 border-2 border-red-200'
                                                    : 'hover:bg-red-50 border-2 border-transparent'
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
                                            <div className="mt-2 ml-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-300">
                                                {renderActionContent(action.id)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divisor */}
                        <div className="border-t border-gray-200 mb-6"></div>

                        {/* Otras Acciones */}
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <Settings className="h-5 w-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-900">Otras Acciones</h3>
                            </div>
                            <div className="space-y-2">
                                {otherActions.map((action) => (
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

export default AddButtonMenu;