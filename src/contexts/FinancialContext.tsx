import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Balance, Transaction } from '../types';

interface FinancialContextType {
    balance: Balance;
    isLoading: boolean;
    error: string | null;
    fetchBalance: () => Promise<void>;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
    const context = useContext(FinancialContext);
    if (context === undefined) {
        throw new Error('useFinancial must be used within a FinancialProvider');
    }
    return context;
};

interface FinancialProviderProps {
    children: ReactNode;
}

export const FinancialProvider = ({ children }: FinancialProviderProps) => {
    const [balance, setBalance] = useState<Balance>({
        total: 0,
        income: 0,
        expenses: 0,
        transactions: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Simulación de datos que vendrían del backend Spring Boot
            const mockTransactions: Transaction[] = [
                {
                    id: '1',
                    description: 'Salario',
                    amount: 150000,
                    date: new Date().toISOString().split('T')[0],
                    type: 'income',
                    category: 'Trabajo'
                },
                {
                    id: '2',
                    description: 'Supermercado',
                    amount: 25000,
                    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                    type: 'expense',
                    category: 'Alimentación'
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
        } catch (err) {
            setError('Error al cargar los datos financieros');
            console.error('Error fetching balance:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transactionData,
            id: Date.now().toString()
        };

        setBalance(prevBalance => {
            const newTransactions = [...prevBalance.transactions, newTransaction];
            const totalIncome = newTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = newTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                total: totalIncome - totalExpenses,
                income: totalIncome,
                expenses: totalExpenses,
                transactions: newTransactions
            };
        });
    };

    const deleteTransaction = async (id: string) => {
        setBalance(prevBalance => {
            const newTransactions = prevBalance.transactions.filter(t => t.id !== id);
            const totalIncome = newTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = newTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                total: totalIncome - totalExpenses,
                income: totalIncome,
                expenses: totalExpenses,
                transactions: newTransactions
            };
        });
    };

    const value: FinancialContextType = {
        balance,
        isLoading,
        error,
        fetchBalance,
        addTransaction,
        deleteTransaction
    };

    return (
        <FinancialContext.Provider value={value}>
            {children}
        </FinancialContext.Provider>
    );
};