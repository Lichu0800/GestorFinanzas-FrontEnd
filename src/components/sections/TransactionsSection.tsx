import { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, Calendar, Download, Eye, Edit, TrendingDown, DollarSign } from 'lucide-react';
import movementService from '../../services/movementService';

interface TransactionWithAccount {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    account: string;
    currency: string;
}

const TransactionsSection = () => {
    const [transactions, setTransactions] = useState<TransactionWithAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const movements = await movementService.getMovements();
            
            // Convertir los movimientos al formato con cuenta
            const formattedTransactions: TransactionWithAccount[] = movements.map(movement => ({
                id: movement.id.toString(),
                date: movement.fecha,
                description: movement.description,
                category: `${movement.category.emoji} ${movement.category.name}`,
                amount: movement.amount,
                type: movement.movementType === 'INGRESO' ? 'income' as const : 'expense' as const,
                account: movement.reference || 'Sin referencia',
                currency: movement.currency
            }));

            setTransactions(formattedTransactions);
        } catch (err) {
            console.error('Error al cargar transacciones:', err);
            setError('No se pudieron cargar las transacciones');
        } finally {
            setIsLoading(false);
        }
    };

    // Calcular estadísticas
    const totalTransactions = transactions.length;
    const thisMonthTotal = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            const now = new Date();
            return transactionDate.getMonth() === now.getMonth() && 
                   transactionDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    
    const totalExpenses = transactions.filter(t => t.type === 'expense').length;
    
    // Calcular ingresos en USD del mes actual
    const thisMonthIncomeUSD = transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            const now = new Date();
            return transactionDate.getMonth() === now.getMonth() && 
                   transactionDate.getFullYear() === now.getFullYear() &&
                   t.type === 'income' &&
                   t.currency === 'USD';
        })
        .reduce((sum, t) => sum + t.amount, 0);

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

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-800">{error}</span>
                    <button 
                        onClick={loadTransactions}
                        className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                    >
                        Reintentar
                    </button>
                </div>
            )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-gray-500 text-sm mb-1">Total Transacciones</p>
                            <p className="text-2xl font-bold text-gray-900 break-words">{totalTransactions}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-gray-500 text-sm mb-1">Balance (Este Mes)</p>
                            <p className={`text-xl lg:text-2xl font-bold break-words ${thisMonthTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {thisMonthTotal >= 0 ? '+' : ''}
                                {new Intl.NumberFormat('es-AR', {
                                    style: 'currency',
                                    currency: 'ARS',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(thisMonthTotal)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                            <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-gray-500 text-sm mb-1">Egresos</p>
                            <p className="text-2xl font-bold text-red-600 break-words">
                                {totalExpenses}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
                            <TrendingDown className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-gray-500 text-sm mb-1">Ingresos USD (Este Mes)</p>
                            <p className="text-xl lg:text-2xl font-bold text-green-600 break-words">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(thisMonthIncomeUSD)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg flex-shrink-0">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de transacciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Transacciones Recientes</h3>
                </div>
                
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay transacciones disponibles</p>
                    </div>
                ) : (
                    <>
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
                                            Referencia
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
                                    {transactions.map((transaction) => (
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
                                                        currency: transaction.currency
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
                                    Mostrando {transactions.length} transacciones
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        Anterior
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                                        1
                                    </button>
                                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionsSection;