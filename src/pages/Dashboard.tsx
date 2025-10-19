import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import FinancialCharts from '../components/FinancialCharts';
import SideMenu from '../components/SideMenu';
import type { Balance, Transaction } from '../types';

const Dashboard = () => {
    const [balance, setBalance] = useState<Balance>({
        total: 0,
        income: 0,
        expenses: 0,
        transactions: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Simular carga de datos - En el futuro esto será una llamada a la API de Spring Boot
        const loadFinancialData = async () => {
            setIsLoading(true);

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Datos de ejemplo que vendrían del backend
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
                {
                    id: '3',
                    description: 'Servicios',
                    amount: 15000,
                    date: '2024-10-03',
                    type: 'expense',
                    category: 'Servicios'
                },
                {
                    id: '4',
                    description: 'Freelance',
                    amount: 50000,
                    date: '2024-10-05',
                    type: 'income',
                    category: 'Trabajo Extra'
                },
                {
                    id: '5',
                    description: 'Transporte',
                    amount: 8000,
                    date: '2024-10-07',
                    type: 'expense',
                    category: 'Transporte'
                },
                {
                    id: '6',
                    description: 'Entretenimiento',
                    amount: 12000,
                    date: '2024-10-10',
                    type: 'expense',
                    category: 'Entretenimiento'
                }
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

            setIsLoading(false);
        };

        loadFinancialData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
            <SideMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Título */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Dashboard Financiero
                        </h2>
                        <p className="text-gray-600">
                            Resumen de tu situación financiera actual
                        </p>
                    </div>

                    {/* Tarjetas de Balance */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <BalanceCard
                            title="Balance Total"
                            amount={balance.total}
                            type="total"
                            change={8.5}
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
                    </div>

                    {/* Gráficos */}
                    <FinancialCharts transactions={balance.transactions} />

                    {/* Transacciones Recientes */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Transacciones Recientes
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {balance.transactions.slice(0, 5).map(transaction => (
                                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {transaction.description}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString('es-AR')} • {transaction.category}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${transaction.type === 'income'
                                                ? 'text-green-600'
                                                : 'text-red-600'
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
                </div>
            </main>
        </div>
    );
};

export default Dashboard;