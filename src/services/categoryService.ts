/**
 * Category Service
 * Servicio para manejar las operaciones CRUD de categorías
 */

import { API_ENDPOINTS } from '../config/api';
import { ENV_CONFIG } from '../config/environment';
import type { Category } from '../types';

interface CategoryResponse {
    success: boolean;
    data?: Category[];
    error?: string;
}

interface SingleCategoryResponse {
    success: boolean;
    data?: Category;
    error?: string;
}

class CategoryService {
    /**
     * Obtiene el token de autenticación
     */
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    /**
     * Obtiene todas las categorías del usuario autenticado
     */
    async getCategories(): Promise<CategoryResponse> {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const response = await fetch(API_ENDPOINTS.FINANCE.CATEGORIES, {
                method: 'GET',
                headers: this.getAuthHeaders(),
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('Token inválido o expirado. Redirigiendo al login...');
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                    window.location.href = '/login';
                    
                    return {
                        success: false,
                        error: 'No autorizado. Por favor, inicia sesión nuevamente.'
                    };
                }
                
                return {
                    success: false,
                    error: `Error ${response.status}: ${response.statusText}`
                };
            }

            const data = await response.json();
            
            return {
                success: true,
                data: Array.isArray(data) ? data : []
            };
        } catch (error: any) {
            console.error('Error getting categories:', error);
            
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Timeout: El servidor no respondió a tiempo.'
                };
            }
            
            return {
                success: false,
                error: error.message || 'Error al obtener las categorías'
            };
        }
    }

    /**
     * Crea una nueva categoría
     */
    async createCategory(category: Omit<Category, 'id'>): Promise<SingleCategoryResponse> {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const response = await fetch(API_ENDPOINTS.FINANCE.CATEGORIES, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(category),
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('Token inválido o expirado. Redirigiendo al login...');
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                    window.location.href = '/login';
                    
                    return {
                        success: false,
                        error: 'No autorizado. Por favor, inicia sesión nuevamente.'
                    };
                }
                
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
            console.error('Error creating category:', error);
            return {
                success: false,
                error: error.message || 'Error al crear la categoría'
            };
        }
    }

    /**
     * Actualiza una categoría existente
     */
    async updateCategory(id: number, category: Partial<Category>): Promise<SingleCategoryResponse> {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const response = await fetch(`${API_ENDPOINTS.FINANCE.CATEGORIES}/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(category),
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('Token inválido o expirado. Redirigiendo al login...');
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                    window.location.href = '/login';
                    
                    return {
                        success: false,
                        error: 'No autorizado. Por favor, inicia sesión nuevamente.'
                    };
                }
                
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
            console.error('Error updating category:', error);
            return {
                success: false,
                error: error.message || 'Error al actualizar la categoría'
            };
        }
    }

    /**
     * Elimina una categoría
     */
    async deleteCategory(id: number): Promise<{ success: boolean; error?: string }> {
        try {
            const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
            
            if (!token) {
                return {
                    success: false,
                    error: 'No hay token de autenticación'
                };
            }

            const response = await fetch(`${API_ENDPOINTS.FINANCE.CATEGORIES}/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders(),
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.warn('Token inválido o expirado. Redirigiendo al login...');
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
                    localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
                    window.location.href = '/login';
                    
                    return {
                        success: false,
                        error: 'No autorizado. Por favor, inicia sesión nuevamente.'
                    };
                }
                
                return {
                    success: false,
                    error: `Error ${response.status}: ${response.statusText}`
                };
            }
            
            return {
                success: true
            };
        } catch (error: any) {
            console.error('Error deleting category:', error);
            return {
                success: false,
                error: error.message || 'Error al eliminar la categoría'
            };
        }
    }
}

const categoryService = new CategoryService();
export default categoryService;
