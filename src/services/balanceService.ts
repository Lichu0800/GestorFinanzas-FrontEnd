/**
 * Balance Service
 * Servicio para manejar las operaciones relacionadas con el balance del usuario
 */

import { API_ENDPOINTS } from '../config/api';
import { ENV_CONFIG } from '../config/environment';
import type { UserBalance } from '../types';

interface BalanceResponse {
    success: boolean;
    data?: UserBalance;
    error?: string;
}

class BalanceService {
    /**
     * Obtiene el balance del usuario autenticado
     */
    async getMyBalance(): Promise<BalanceResponse> {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const response = await fetch(API_ENDPOINTS.FINANCE.BALANCE_ME, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return {
                    success: false,
                    error: `Error ${response.status}: ${response.statusText}`
                };
            }

            const data = await response.json();
            
            return {
                success: true,
                data: data
            };
        } catch (error: any) {
            console.error('Error getting balance:', error);
            return {
                success: false,
                error: error.message || 'Error al obtener el balance'
            };
        }
    }

    /**
     * Refresca el balance desde el servidor
     */
    async refreshBalance(): Promise<BalanceResponse> {
        return this.getMyBalance();
    }
}

const balanceService = new BalanceService();
export default balanceService;
