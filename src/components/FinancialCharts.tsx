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
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                },
                {
                    label: 'Gastos',
                    data: expenseData,
                    borderColor: 'rgb(244, 63, 94)',
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: 'rgb(244, 63, 94)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
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
            'rgb(139, 92, 246)',
            'rgb(244, 63, 94)',
            'rgb(251, 146, 60)',
            'rgb(16, 185, 129)',
            'rgb(168, 85, 247)',
            'rgb(236, 72, 153)',
            'rgb(59, 130, 246)',
            'rgb(34, 197, 94)',
        ];

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverBorderWidth: 4,
                    hoverBorderColor: '#fff',
                },
            ],
        };
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 13,
                        weight: 'bold' as const,
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            title: {
                display: true,
                text: '📈 Ingresos vs Gastos por Mes',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
                padding: {
                    bottom: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
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
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    },
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            title: {
                display: true,
                text: '🍩 Gastos por Categoría',
                font: {
                    size: 16,
                    weight: 'bold' as const,
                },
                padding: {
                    bottom: 20,
                },
            },
        },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
                <Line options={lineOptions} data={getMonthlyData()} />
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
                <Doughnut options={doughnutOptions} data={getCategoryData()} />
            </div>
        </div>
    );
};

export default FinancialCharts;