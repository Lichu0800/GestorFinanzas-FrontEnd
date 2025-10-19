import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import type { Transaction } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface FinancialChartsProps {
    transactions: Transaction[];
}

const FinancialCharts = ({ transactions }: FinancialChartsProps) => {
    // Preparar datos para gráfico de líneas (balance por mes)
    const getMonthlyData = () => {
        const monthlyTotals: { [key: string]: { income: number; expense: number } } = {};

        transactions.forEach(transaction => {
            const month = new Date(transaction.date).toLocaleString('es-AR', { month: 'short', year: '2-digit' });

            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'income') {
                monthlyTotals[month].income += transaction.amount;
            } else {
                monthlyTotals[month].expense += transaction.amount;
            }
        });

        const labels = Object.keys(monthlyTotals).sort();
        const incomeData = labels.map(month => monthlyTotals[month].income);
        const expenseData = labels.map(month => monthlyTotals[month].expense);

        return {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeData,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.1,
                },
                {
                    label: 'Gastos',
                    data: expenseData,
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.1,
                },
            ],
        };
    };

    // Preparar datos para gráfico de dona (gastos por categoría)
    const getCategoryData = () => {
        const expensesByCategory: { [key: string]: number } = {};

        transactions.filter(t => t.type === 'expense').forEach(transaction => {
            expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        });

        const labels = Object.keys(expensesByCategory);
        const data = Object.values(expensesByCategory);

        const colors = [
            'rgb(99, 102, 241)',
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)',
            'rgb(34, 197, 94)',
            'rgb(168, 85, 247)',
            'rgb(236, 72, 153)',
        ];

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            ],
        };
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Ingresos vs Gastos por Mes',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any) {
                        return new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            minimumFractionDigits: 0,
                        }).format(value);
                    },
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Gastos por Categoría',
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <Line options={lineOptions} data={getMonthlyData()} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <Doughnut options={doughnutOptions} data={getCategoryData()} />
            </div>
        </div>
    );
};

export default FinancialCharts;