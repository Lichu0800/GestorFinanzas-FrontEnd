import { CreditCard, Search, Filter, Calendar, Download, Eye, Edit, Trash2 } from 'lucide-react';

const TransactionsSection = () => {
    const mockTransactions = [
        {
            id: '1',
            date: '2024-10-19',
            description: 'Salario Mensual',
            category: 'Trabajo',
            amount: 150000,
            type: 'income',
            account: 'Cuenta Principal'
        },
        {
            id: '2',
            date: '2024-10-18',
            description: 'Supermercado Carrefour',
            category: 'Alimentación',
            amount: 25000,
            type: 'expense',
            account: 'Tarjeta de Débito'
        },
        {
            id: '3',
            date: '2024-10-17',
            description: 'Pago de Servicios',
            category: 'Servicios',
            amount: 15000,
            type: 'expense',
            account: 'Cuenta Principal'
        },
        {
            id: '4',
            date: '2024-10-16',
            description: 'Trabajo Freelance',
            category: 'Trabajo Extra',
            amount: 50000,
            type: 'income',
            account: 'Cuenta Ahorros'
        },
        {
            id: '5',
            date: '2024-10-15',
            description: 'Transporte Público',
            category: 'Transporte',
            amount: 8000,
            type: 'expense',
            account: 'Efectivo'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Título de la sección */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-green-600" />
                    Historial de Transacciones
                </h2>
                <p className="text-gray-600">
                    Gestiona y revisa todas tus transacciones financieras
                </p>
            </div>

            {/* Barra de herramientas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        {/* Buscador */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar transacciones..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filtro por fecha */}
                        <div className="flex gap-2">
                            <input
                                type="date"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <input
                                type="date"
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                        </button>
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </button>
                    </div>
                </div>
            </div>

            {/* Resumen rápido */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Transacciones</p>
                            <p className="text-2xl font-bold text-gray-900">248</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Este Mes</p>
                            <p className="text-2xl font-bold text-green-600">+$200,000</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Promedio Diario</p>
                            <p className="text-2xl font-bold text-purple-600">$8,750</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Pendientes</p>
                            <p className="text-2xl font-bold text-orange-600">3</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Eye className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de transacciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cuenta
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(transaction.date).toLocaleDateString('es-AR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.account}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {new Intl.NumberFormat('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS'
                                            }).format(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Paginación */}
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Mostrando 1 a 5 de 248 transacciones
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                Anterior
                            </button>
                            <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                                1
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                3
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsSection;