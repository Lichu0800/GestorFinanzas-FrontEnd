/**
 * API Configuration
 * Configuración centralizada para las URLs de la API
 */

// Configuración del entorno
const API_CONFIG = {
  // IP del servidor backend Spring Boot
  HOST: '192.168.0.214',
  
  // Puerto del servidor backend (Spring Boot default: 8080, tu caso: 8080)
  PORT: 8080,
  
  // Protocolo (http o https)
  PROTOCOL: 'http',
  
  // Contexto de la aplicación Spring Boot (si tienes server.servlet.context-path configurado)
  CONTEXT_PATH: '',
  
  // Prefijo de la API (típico en Spring Boot)
  API_PREFIX: 'api',
  
  // Versión de la API (opcional)
  API_VERSION: 'v1',
} as const;

// URL base construida automáticamente
const BASE_URL = `${API_CONFIG.PROTOCOL}://${API_CONFIG.HOST}:${API_CONFIG.PORT}${API_CONFIG.CONTEXT_PATH}`;

// URL base de la API con prefijo y versión (típico Spring Boot: /api/v1)
const API_BASE_URL = `${BASE_URL}/${API_CONFIG.API_PREFIX}/${API_CONFIG.API_VERSION}`;

// Endpoints específicos de la API
export const API_ENDPOINTS = {
  // Base URLs
  BASE_URL,
  API_BASE_URL,
  
  // Autenticación (Spring Security endpoints específicos)
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`, // Endpoint directo sin /api/v1
    LOGOUT: `${BASE_URL}/auth/logout`, // Endpoint directo para invalidar token
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    REGISTER: `${BASE_URL}/api/users`, // Endpoint específico para registro de usuarios
  },
  
  // Finanzas (controladores REST típicos de Spring Boot)
  FINANCE: {
    BALANCE: `${API_BASE_URL}/finanzas/balance`,
    BALANCE_ME: `${BASE_URL}/api/balance/me`, // Endpoint específico para balance del usuario
    TRANSACTIONS: `${API_BASE_URL}/finanzas/transacciones`,
    CATEGORIES: `${API_BASE_URL}/finanzas/categorias`,
    REPORTS: `${API_BASE_URL}/finanzas/reportes`,
    ACCOUNTS: `${API_BASE_URL}/finanzas/cuentas`,
  },
  
  // Dashboard
  DASHBOARD: {
    OVERVIEW: `${API_BASE_URL}/dashboard/resumen`,
    STATS: `${API_BASE_URL}/dashboard/estadisticas`,
  },
  
  // Usuarios (si tienes gestión de usuarios)
  USERS: {
    PROFILE: `${API_BASE_URL}/usuarios/perfil`,
    UPDATE: `${API_BASE_URL}/usuarios/actualizar`,
  },
} as const;

// Configuración por defecto para las peticiones
export const DEFAULT_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
} as const;

// Función helper para construir URLs personalizadas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// Función para verificar si el servidor Spring Boot está disponible
// Spring Boot Actuator health endpoint
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    // Intentar con Actuator health endpoint primero
    const actuatorResponse = await fetch(`${BASE_URL}/actuator/health`, {
      method: 'GET',
      ...DEFAULT_CONFIG,
    });
    
    if (actuatorResponse.ok) {
      return true;
    }
    
    // Si Actuator no está disponible, intentar con un endpoint básico
    const basicResponse = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      ...DEFAULT_CONFIG,
    });
    
    return basicResponse.ok;
  } catch (error) {
    console.error('Error checking server health:', error);
    return false;
  }
};

export default API_ENDPOINTS;