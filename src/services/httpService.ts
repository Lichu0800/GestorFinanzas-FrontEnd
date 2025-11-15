/**
 * HTTP Service
 * Servicio base para realizar peticiones HTTP a la API
 */

import { API_ENDPOINTS, DEFAULT_CONFIG } from '../config/api';
import { ENV_CONFIG } from '../config/environment';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Configuración de errores
export class ApiError extends Error {
  public status?: number;
  public response?: any;

  constructor(
    message: string,
    status?: number,
    response?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Clase principal del servicio HTTP
class HttpService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_ENDPOINTS.API_BASE_URL;
    this.defaultHeaders = {
      ...DEFAULT_CONFIG.headers,
    };
  }

  // Método privado para obtener headers con token
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    const headers = { ...this.defaultHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Método privado para manejar respuestas
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Si es error 401 o 403, el token es inválido - limpiar y redirigir al login
      if (response.status === 401 || response.status === 403) {
        console.warn('Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(ENV_CONFIG.STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }

      throw new ApiError(
        data.message || data.error || `HTTP Error: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  }

  // Método GET
  async get<T>(endpoint: string, useFullUrl: boolean = false): Promise<ApiResponse<T>> {
    try {
      const url = useFullUrl ? endpoint : `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  // Método POST
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  // Método PUT
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  // Método DELETE
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: AbortSignal.timeout(DEFAULT_CONFIG.timeout),
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }

  // Método para verificar conexión con el servidor
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000), // 5 segundos para health check
      });
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }
}

// Instancia singleton del servicio
const httpService = new HttpService();

export default httpService;