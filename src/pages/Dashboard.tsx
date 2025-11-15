import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import CurrencyBalanceCard from '../components/CurrencyBalanceCard';
import FinancialCharts from '../components/FinancialCharts';
import NavigationMenu from '../components/NavigationMenu';
import AddButtonMenu from '../components/AddButtonMenu';
import AnalyticsSection from '../components/sections/AnalyticsSection';
import TransactionsSection from '../components/sections/TransactionsSection';
import CategoriesSection from '../components/sections/CategoriesSection';
import movementService from '../services/movementService';
import type { Balance, Transaction } from '../types';

const Dashboard = () => {
    const { balance: userBalance, refreshBalance } = useAuth();
    const [balance, setBalance] = useState<Balance>({
        total: 0,
        income: 0,
        expenses: 0,
        transactions: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRefreshBalance = async () => {
        setIsRefreshing(true);
        try {
            await refreshBalance();
            await loadFinancialData(); // Recargar también los movimientos
        } finally {
            setIsRefreshing(false);
        }
    };

    const loadFinancialData = async () => {
        try {
            setError(null);
            
            // Obtener transacciones desde el backend
            const transactions = await movementService.getTransactions();

            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            setBalance({
                total: totalIncome - totalExpenses,
                income: totalIncome,
                expenses: totalExpenses,
                transactions: transactions
            });
        } catch (err) {
            console.error('Error al cargar los movimientos:', err);
            setError('No se pudieron cargar los movimientos del servidor');
            
            // Cargar datos de ejemplo si falla
            const mockTransactions: Transaction[] = [
                {
                    id: '1',
                    description: 'Salario',
                    amount: 150000,
                    date: '2024-10-01',
                    type: 'income',
                    category: 'Trabajo'
                },
                {
                    id: '2',
                    description: 'Supermercado',
                    amount: 25000,
                    date: '2024-10-02',
                    type: 'expense',
                    category: 'Alimentación'
                },
            ];

            const totalIncome = mockTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = mockTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            setBalance({
                total: totalIncome - totalExpenses,
                income: totalIncome,
                expenses: totalExpenses,
                transactions: mockTransactions
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFinancialData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header onMenuToggle={() => setIsNavigationOpen(!isNavigationOpen)} />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    // Función para renderizar contenido según la sección activa
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'analytics':
                return <AnalyticsSection />;
            case 'transactions':
                return <TransactionsSection />;
            case 'categories':
                return <CategoriesSection />;
            case 'goals':
                return (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Metas Financieras - Próximamente</p>
                    </div>
                );
            case 'investments':
                return (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Inversiones - Próximamente</p>
                    </div>
                );
            case 'calendar':
                return (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Calendario Financiero - Próximamente</p>
                    </div>
                );
            case 'profile':
                return (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Perfil y Cuentas - Próximamente</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Configuración - Próximamente</p>
                    </div>
                );
            default: // dashboard
                return (
                    <div className="space-y-6">
                        {/* Título */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                                Dashboard Financiero
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Resumen de tu situación financiera actual
                            </p>
                        </div>

                        {/* Tarjetas de Balance */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
                            {/* Mensaje de error si no se pudo cargar el balance */}
                            {(!userBalance || error) && (
                                <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-sm text-yellow-800">
                                        {error || 'No se pudo cargar el balance del servidor. Mostrando datos simulados.'}
                                    </span>
                                </div>
                            )}
                            
                            <BalanceCard
                                title="Balance Total"
                                amount={balance.total}
                                type="total"
                                change={8.5}
                                showCurrencySwitch={true}
                            />
                            <BalanceCard
                                title="Ingresos"
                                amount={balance.income}
                                type="income"
                                change={12.3}
                            />
                            <BalanceCard
                                title="Gastos"
                                amount={balance.expenses}
                                type="expense"
                                change={-5.2}
                            />
                            <CurrencyBalanceCard
                                currency="ARS"
                                amount={userBalance?.ars || 0}
                                onRefresh={handleRefreshBalance}
                                isRefreshing={isRefreshing}
                            />
                            <CurrencyBalanceCard
                                currency="USD"
                                amount={userBalance?.dolares || 0}
                                onRefresh={handleRefreshBalance}
                                isRefreshing={isRefreshing}
                            />
                        </div>

                        {/* Transacciones Recientes */}
                        <div className="bg-white rounded-2xl shadow-lg border border-primary-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary-50 via-accent-50 to-secondary-50 px-6 py-4 border-b border-primary-200">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
                                    📋 Transacciones Recientes
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-3">
                                    {balance.transactions.slice(0, 5).map(transaction => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {transaction.description}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    📅 {new Date(transaction.date).toLocaleDateString('es-AR')} • 🏷️ {transaction.category}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold text-lg ${transaction.type === 'income'
                                                    ? 'text-emerald-600'
                                                    : 'text-rose-600'
                                                    }`}>
                                                    {transaction.type === 'income' ? '+' : '-'}
                                                    {new Intl.NumberFormat('es-AR', {
                                                        style: 'currency',
                                                        currency: 'ARS'
                                                    }).format(transaction.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Gráficos */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <FinancialCharts transactions={balance.transactions} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50/40 to-secondary-50/40 relative">
            <Header onMenuToggle={() => setIsNavigationOpen(!isNavigationOpen)} />
            
            {/* Menú de Navegación (reemplaza al SideMenu original) */}
            <NavigationMenu
                isOpen={isNavigationOpen}
                onClose={() => setIsNavigationOpen(false)}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            <main className="max-w-[1920px] mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="py-4">
                    {renderSectionContent()}
                </div>
            </main>

            {/* Botón flotante para acciones rápidas */}
            <AddButtonMenu onMovementCreated={loadFinancialData} />
        </div>
    );
};

export default Dashboard;