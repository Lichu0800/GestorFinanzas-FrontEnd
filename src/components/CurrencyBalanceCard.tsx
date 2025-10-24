import { DollarSign, RefreshCw } from 'lucide-react';

interface CurrencyBalanceCardProps {
    currency: 'ARS' | 'USD';
    amount: number;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const CurrencyBalanceCard = ({ currency, amount, onRefresh, isRefreshing = false }: CurrencyBalanceCardProps) => {
    const currencySymbol = currency === 'ARS' ? '$' : 'US$';
    const currencyName = currency === 'ARS' ? 'Pesos Argentinos' : 'Dólares';
    const bgColor = currency === 'ARS' ? 'bg-blue-50' : 'bg-green-50';
    const textColor = currency === 'ARS' ? 'text-blue-600' : 'text-green-600';
    const iconBgColor = currency === 'ARS' ? 'bg-blue-100' : 'bg-green-100';

    return (
        <div className={`${bgColor} rounded-xl shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`${iconBgColor} p-3 rounded-lg`}>
                        <DollarSign className={`h-6 w-6 ${textColor}`} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">{currencyName}</p>
                        <p className="text-xs text-gray-500">{currency}</p>
                    </div>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className={`p-2 rounded-lg transition-colors ${textColor} hover:bg-white disabled:opacity-50`}
                        title="Actualizar balance"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                )}
            </div>
            
            <div className="mt-2">
                <p className={`text-3xl font-bold ${textColor}`}>
                    {currencySymbol} {amount.toLocaleString(currency === 'ARS' ? 'es-AR' : 'en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </p>
            </div>
        </div>
    );
};

export default CurrencyBalanceCard;
