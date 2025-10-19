export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    category: string;
}

export interface Balance {
    total: number;
    income: number;
    expenses: number;
    transactions: Transaction[];
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}