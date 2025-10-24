/**
 * Hook para manejar logout con notificaciones
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useLogoutWithNotification = () => {
  const { logout: originalLogout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState<string>('');

  const logout = async (): Promise<void> => {
    setIsLoggingOut(true);
    setLogoutMessage('');

    try {
      await originalLogout();
      setLogoutMessage('Sesión cerrada exitosamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setLogoutMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error during logout:', error);
      setLogoutMessage('Error al cerrar sesión');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    logout,
    isLoggingOut,
    logoutMessage,
  };
};