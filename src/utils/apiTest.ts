/**
 * Utilidad para probar la conexión con el backend
 */

import { API_ENDPOINTS } from '../config/api';

export const testApiConnection = async (): Promise<{ 
  success: boolean; 
  message: string; 
  endpoint?: string 
}> => {
  try {
    // Probar endpoint de login con datos inválidos para verificar conexión
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test_connection',
        password: 'test_connection'
      }),
    });

    // Si obtenemos cualquier respuesta (incluso error 401), significa que la conexión funciona
    if (response.status === 401 || response.status === 403) {
      return {
        success: true,
        message: 'Conexión exitosa con el backend',
        endpoint: API_ENDPOINTS.AUTH.LOGIN
      };
    }

    // Si obtenemos respuesta 200, también es bueno
    if (response.ok) {
      return {
        success: true,
        message: 'Conexión exitosa con el backend',
        endpoint: API_ENDPOINTS.AUTH.LOGIN
      };
    }

    // Otros códigos de estado
    return {
      success: false,
      message: `Backend responde pero con error: ${response.status}`,
      endpoint: API_ENDPOINTS.AUTH.LOGIN
    };

  } catch (error: any) {
    // Error de red o CORS
    if (error.message.includes('CORS')) {
      return {
        success: false,
        message: 'Error de CORS: Configura CORS en tu backend Spring Boot',
        endpoint: API_ENDPOINTS.AUTH.LOGIN
      };
    }

    if (error.message.includes('fetch')) {
      return {
        success: false,
        message: 'No se puede conectar al backend. Verifica que esté corriendo en el puerto 8080',
        endpoint: API_ENDPOINTS.AUTH.LOGIN
      };
    }

    return {
      success: false,
      message: `Error de conexión: ${error.message}`,
      endpoint: API_ENDPOINTS.AUTH.LOGIN
    };
  }
};

/**
 * Probar endpoint de logout
 */
export const testLogoutEndpoint = async (jwt: string): Promise<{ 
  success: boolean; 
  message: string; 
  endpoint?: string 
}> => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Logout exitoso',
        endpoint: API_ENDPOINTS.AUTH.LOGOUT
      };
    } else {
      return {
        success: false,
        message: `Error ${response.status}: ${response.statusText}`,
        endpoint: API_ENDPOINTS.AUTH.LOGOUT
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Error de conexión en logout: ${error.message}`,
      endpoint: API_ENDPOINTS.AUTH.LOGOUT
    };
  }
};

// Hook para usar en componentes React
export const useApiTest = () => {
  const testConnection = async () => {
    const result = await testApiConnection();
    console.log('🔍 Test de conexión API:', result);
    return result;
  };

  const testLogout = async (jwt: string) => {
    const result = await testLogoutEndpoint(jwt);
    console.log('🚪 Test de logout API:', result);
    return result;
  };

  return { testConnection, testLogout };
};