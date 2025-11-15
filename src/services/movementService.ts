/**
 * Movement Service
 * Servicio para manejar los movimientos financieros
 */

import API_ENDPOINTS from '../config/api';
import { ENV_CONFIG } from '../config/environment';
import type { Movement, Transaction } from '../types';

// Tipo para crear un nuevo movimiento
export interface CreateMovementData {
    description: string;
    amount: number;
    movementType: 'INGRESO' | 'EGRESO';
    currency: 'ARS' | 'USD';
    categoryID: number;
    fecha: string; // ISO-8601
    reference?: string; // Referencia opcional
}

class MovementService {
    /**
     * Obtiene todos los movimientos del usuario
     */
    async getMovements(): Promise<Movement[]> {
        const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        
        console.log('🔑 Token encontrado:', token ? 'Sí (primeros 20 chars: ' + token.substring(0, 20) + '...)' : 'No');
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_ENDPOINTS.BASE_URL}/api/movement`;
        console.log('🌐 Haciendo petición GET a:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('📡 Respuesta del servidor:', response.status, response.statusText);

        if (!response.ok) {
            // Si es 401 o 403, el token es inválido - limpiar y redirigir
            if (response.status === 401 || response.status === 403) {
                console.warn('Token inválido o expirado. Redirigiendo al login...');
                localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                window.location.href = '/login';
            }
            
            const errorText = await response.text();
            console.error('❌ Error al obtener movimientos:', response.status, errorText);
            throw new Error(`Error al obtener los movimientos: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Movimientos recibidos:', data.length, 'movimientos');
        
        return data;
    }

    /**
     * Convierte los movimientos del backend al formato Transaction usado en el frontend
     */
    convertToTransactions(movements: Movement[]): Transaction[] {
        return movements.map(movement => ({
            id: movement.id.toString(),
            description: movement.description,
            amount: movement.amount,
            date: movement.fecha,
            type: movement.movementType === 'INGRESO' ? 'income' as const : 'expense' as const,
            category: `${movement.category.emoji} ${movement.category.name}`,
        }));
    }

    /**
     * Obtiene los movimientos y los convierte al formato Transaction
     */
    async getTransactions(): Promise<Transaction[]> {
        const movements = await this.getMovements();
        return this.convertToTransactions(movements);
    }

    /**
     * Crea un nuevo movimiento
     */
    async createMovement(movementData: CreateMovementData): Promise<Movement> {
        const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const url = `${API_ENDPOINTS.BASE_URL}/api/movement`;
        console.log('🆕 Creando movimiento:', movementData);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(movementData),
        });

        console.log('📡 Respuesta del servidor:', response.status, response.statusText);

        if (!response.ok) {
            // Si es 401 o 403, el token es inválido - limpiar y redirigir
            if (response.status === 401 || response.status === 403) {
                console.warn('Token inválido o expirado. Redirigiendo al login...');
                localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                window.location.href = '/login';
            }
            
            const errorText = await response.text();
            console.error('❌ Error al crear movimiento:', response.status, errorText);
            throw new Error(`Error al crear el movimiento: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Movimiento creado exitosamente:', data);
        
        return data;
    }
}

const movementService = new MovementService();
export default movementService;
