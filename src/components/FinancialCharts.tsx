import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '../types';

interface FinancialChartsProps {
    transactions: Transaction[];
}

const FinancialCharts = ({ transactions }: FinancialChartsProps) => {

    // Calcular estadísticas mensuales
    const getMonthlyStats = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const totalIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpenses;
        const transactionCount = currentMonthTransactions.length;

        return { totalIncome, totalExpenses, balance, transactionCount };
    };

    // Calcular gastos por categoría (top 5)
    const getTopCategories = () => {
        const expensesByCategory: { [key: string]: number } = {};

        transactions.filter(t => t.type === 'expense').forEach(transaction => {
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        });

        return Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category, amount]) => ({ category, amount }));
    };

    // Calcular promedio diario
    const getDailyAverage = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const totalExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return totalExpenses / daysInMonth;
    };

    const stats = getMonthlyStats();
    const topCategories = getTopCategories();
    const dailyAverage = getDailyAverage();

    return (
        <div className="space-y-6">
            {/* Título */}
            <div className="flex items-center gap-2">
                <PieChart className="h-6 w-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">
                    Resumen Financiero
                </h3>
            </div>

            {/* Tarjetas de estadísticas del mes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ingresos del mes */}
                <div className="p-5 rounded-xl border-2 transition-all bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                        </div>
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium mb-1 text-gray-600">
                        Ingresos del Mes
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0
                        }).format(stats.totalIncome)}
                    </p>
                </div>

                {/* Gastos del mes */}
                <div className="p-5 rounded-xl border-2 transition-all bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-red-100">
                            <ArrowDownRight className="h-5 w-5 text-red-600" />
                        </div>
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium mb-1 text-gray-600">
                        Gastos del Mes
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                        {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0
                        }).format(stats.totalExpenses)}
                    </p>
                </div>

                {/* Balance del mes */}
                <div className="p-5 rounded-xl border-2 transition-all bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-indigo-100">
                            <DollarSign className="h-5 w-5 text-indigo-600" />
                        </div>
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium mb-1 text-gray-600">
                        Balance del Mes
                    </p>
                    <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0
                        }).format(stats.balance)}
                    </p>
                </div>

                {/* Promedio diario */}
                <div className="p-5 rounded-xl border-2 transition-all bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <TrendingDown className="h-5 w-5 text-blue-600" />
                        </div>
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium mb-1 text-gray-600">
                        Promedio Diario
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0
                        }).format(dailyAverage)}
                    </p>
                </div>
            </div>

            {/* Top 5 Categorías de Gastos */}
            {topCategories.length > 0 && (
                <div className="rounded-xl p-6 border bg-white border-gray-200">
                    <h4 className="text-lg font-bold mb-4 text-gray-900">
                        📊 Top 5 Categorías de Gastos
                    </h4>
                    <div className="space-y-3">
                        {topCategories.map((item, index) => {
                            const percentage = (item.amount / stats.totalExpenses) * 100;
                            return (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.category}
                                        </span>
                                        <span className="text-sm font-bold text-indigo-600">
                                            {new Intl.NumberFormat('es-AR', {
                                                style: 'currency',
                                                currency: 'ARS',
                                                minimumFractionDigits: 0
                                            }).format(item.amount)}
                                        </span>
                                    </div>
                                    <div className="w-full rounded-full h-2 bg-gray-200">
                                        <div
                                            className="h-2 rounded-full transition-all bg-indigo-600"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialCharts;