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
                },
                signal: AbortSignal.timeout(5000) // Timeout de 5 segundos
            });

            if (!response.ok) {
                const errorMessage = `Error ${response.status}: ${response.statusText}`;
                
                // Si es 401 o 403, el token es inválido - limpiar y redirigir
                if (response.status === 401 || response.status === 403) {
                    console.warn('Token inválido o expirado. Redirigiendo al login...');
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                    window.location.href = '/login';
                    
                    return {
                        success: false,
                        error: `Token inválido o expirado`
                    };
                }
                
                return {
                    success: false,
                    error: errorMessage
                };
            }

            const data = await response.json();
            
            return {
                success: true,
                data: data
            };
        } catch (error: any) {
            console.error('Error getting balance:', error);
            
            // Detectar si es un error de red (backend no disponible)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return {
                    success: false,
                    error: 'Backend no disponible. Por favor, verifica que el servidor esté en funcionamiento.'
                };
            }
            
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Timeout: El servidor no respondió a tiempo.'
                };
            }
            
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
