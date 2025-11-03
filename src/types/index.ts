export interface User {
    id: string;
    username: string;
    email: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    username: string;
    message: string;
    jwt: string;
    status: boolean;
}

export interface LogoutResponse {
    message: string;
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    category: string;
}

export interface Stock {
    symbol: string;
    quantity: number;
    value: number;
}

export interface UserBalance {
    id: number;
    ars: number;
    dolares: number;
    stockList: Stock[];
}

export interface Balance {
    total: number;
    income: number;
    expenses: number;
    transactions: Transaction[];
}

export interface RegisterCredentials {
    username: string;
    password: string;
    enabled?: boolean;
    accountNotExpired?: boolean;
    accountNotLocked?: boolean;
    credentialNotExpired?: boolean;
    rolesList: Array<{ id: number }>;
}

export interface AuthContextType {
    user: User | null;
    balance: UserBalance | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    register: (registerData: RegisterCredentials) => Promise<{ success: boolean; message?: string }>;
    refreshBalance: () => Promise<void>;
    isLoading: boolean;
    backendUnavailable: boolean;
    retryConnection: () => Promise<void>;
}