/**
 * Finance Service
 * Servicio específico para manejo de datos financieros con Spring Boot backend
 */

import httpService from './httpService';
import type { ApiResponse } from './httpService';

// Tipos específicos para el dominio financiero
export interface Balance {
  id: number;
  totalIngresos: number;
  totalGastos: number;
  saldoActual: number;
  fechaActualizacion: Date;
}

export interface Transaccion {
  id: number;
  descripcion: string;
  monto: number;
  tipo: 'INGRESO' | 'GASTO';
  categoria: Categoria;
  fecha: Date;
  cuentaId: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: 'INGRESO' | 'GASTO';
  color?: string;
}

export interface Cuenta {
  id: number;
  nombre: string;
  tipo: 'AHORRO' | 'CORRIENTE' | 'CREDITO';
  saldo: number;
  activa: boolean;
}

export interface ReporteFinanciero {
  periodo: string;
  totalIngresos: number;
  totalGastos: number;
  saldoNeto: number;
  transaccionesPorCategoria: Array<{
    categoria: string;
    total: number;
    porcentaje: number;
  }>;
}

// Parámetros para filtros
export interface FiltroTransacciones {
  fechaInicio?: string;
  fechaFin?: string;
  categoriaId?: number;
  tipo?: 'INGRESO' | 'GASTO';
  cuentaId?: number;
  page?: number;
  size?: number;
}

class FinanceService {
  // Obtener balance actual
  async getBalance(): Promise<ApiResponse<Balance>> {
    return await httpService.get<Balance>('/finanzas/balance');
  }

  // Obtener todas las transacciones con filtros opcionales
  async getTransacciones(filtros?: FiltroTransacciones): Promise<ApiResponse<Transaccion[]>> {
    let endpoint = '/finanzas/transacciones';
    
    if (filtros) {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
    }
    
    return await httpService.get<Transaccion[]>(endpoint);
  }

  // Crear nueva transacción
  async crearTransaccion(transaccion: Omit<Transaccion, 'id'>): Promise<ApiResponse<Transaccion>> {
    return await httpService.post<Transaccion>('/finanzas/transacciones', transaccion);
  }

  // Actualizar transacción existente
  async actualizarTransaccion(id: number, transaccion: Partial<Transaccion>): Promise<ApiResponse<Transaccion>> {
    return await httpService.put<Transaccion>(`/finanzas/transacciones/${id}`, transaccion);
  }

  // Eliminar transacción
  async eliminarTransaccion(id: number): Promise<ApiResponse<void>> {
    return await httpService.delete<void>(`/finanzas/transacciones/${id}`);
  }

  // Obtener todas las categorías
  async getCategorias(): Promise<ApiResponse<Categoria[]>> {
    return await httpService.get<Categoria[]>('/finanzas/categorias');
  }

  // Crear nueva categoría
  async crearCategoria(categoria: Omit<Categoria, 'id'>): Promise<ApiResponse<Categoria>> {
    return await httpService.post<Categoria>('/finanzas/categorias', categoria);
  }

  // Obtener todas las cuentas
  async getCuentas(): Promise<ApiResponse<Cuenta[]>> {
    return await httpService.get<Cuenta[]>('/finanzas/cuentas');
  }

  // Crear nueva cuenta
  async crearCuenta(cuenta: Omit<Cuenta, 'id'>): Promise<ApiResponse<Cuenta>> {
    return await httpService.post<Cuenta>('/finanzas/cuentas', cuenta);
  }

  // Obtener reporte financiero
  async getReporte(periodo: string): Promise<ApiResponse<ReporteFinanciero>> {
    return await httpService.get<ReporteFinanciero>(`/finanzas/reportes?periodo=${periodo}`);
  }

  // Obtener estadísticas para el dashboard
  async getEstadisticasDashboard(): Promise<ApiResponse<any>> {
    return await httpService.get<any>('/dashboard/estadisticas');
  }

  // Obtener resumen para el dashboard
  async getResumenDashboard(): Promise<ApiResponse<any>> {
    return await httpService.get<any>('/dashboard/resumen');
  }
}

// Instancia singleton del servicio de finanzas
const financeService = new FinanceService();

export default financeService;