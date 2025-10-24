import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useState } from 'react';

interface BalanceCardProps {
    title: string;
    amount: number;
    type: 'total' | 'income' | 'expense';
    change?: number;
    showCurrencySwitch?: boolean;
}

const BalanceCard = ({ title, amount, type, change, showCurrencySwitch = false }: BalanceCardProps) => {
    const [showInUSD, setShowInUSD] = useState(false);
    const DOLLAR_RATE = 1000; // Precio del dólar (puedes cambiarlo)

    const formatCurrency = (value: number, inUSD: boolean = false) => {
        if (inUSD) {
            const usdValue = value / DOLLAR_RATE;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(usdValue);
        }
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
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        {showCurrencySwitch && type === 'total' && (
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setShowInUSD(false)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        !showInUSD 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    ARS
                                </button>
                                <button
                                    onClick={() => setShowInUSD(true)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        showInUSD 
                                            ? 'bg-green-600 text-white' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    USD
                                </button>
                            </div>
                        )}
                    </div>
                    <p className={`text-2xl font-bold ${getColorClasses().split(' ')[0]}`}>
                        {formatCurrency(amount, showInUSD && type === 'total')}
                    </p>
                    {change && (
                        <p className="text-sm text-gray-500 mt-1">
                            {change > 0 ? '+' : ''}{change.toFixed(1)}% este mes
                        </p>
                    )}
                    {showInUSD && type === 'total' && (
                        <p className="text-xs text-gray-400 mt-1">
                            Cotización: ${DOLLAR_RATE.toLocaleString('es-AR')}
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