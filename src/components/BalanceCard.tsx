import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BalanceCardProps {
    title: string;
    amount: number;
    type: 'total' | 'income' | 'expense';
    change?: number;
}

const BalanceCard = ({ title, amount, type, change }: BalanceCardProps) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(value);
    };

    const getIcon = () => {
        switch (type) {
            case 'income':
                return <TrendingUp className="h-6 w-6 text-green-600" />;
            case 'expense':
                return <TrendingDown className="h-6 w-6 text-red-600" />;
            default:
                return <DollarSign className="h-6 w-6 text-indigo-600" />;
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'income':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'expense':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        }
    };

    return (
        <div className={`bg-white p-6 rounded-xl shadow-sm border-2 ${getColorClasses().split(' ').slice(-1)[0]} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className={`text-2xl font-bold ${getColorClasses().split(' ')[0]}`}>
                        {formatCurrency(amount)}
                    </p>
                    {change && (
                        <p className="text-sm text-gray-500 mt-1">
                            {change > 0 ? '+' : ''}{change.toFixed(1)}% este mes
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses().split(' ').slice(1, 3).join(' ')}`}>
                    {getIcon()}
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;