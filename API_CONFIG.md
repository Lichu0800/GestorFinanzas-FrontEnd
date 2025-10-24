# Configuración de API - Spring Boot Backend

Este proyecto está configurado para conectarse con un backend desarrollado en **Java Spring Boot**.

## 🔧 Configuración Actual

- **Backend**: Java Spring Boot
- **IP del servidor**: `192.168.0.214`
- **Puerto**: `8000`
- **Base URL**: `http://192.168.0.214:8000/api/v1`

## 📁 Estructura de Archivos

```
src/
├── config/
│   ├── api.ts              # Configuración de endpoints de la API
│   └── environment.ts      # Variables de entorno y configuración general
├── services/
│   ├── httpService.ts      # Servicio base para peticiones HTTP
│   ├── authService.ts      # Servicio de autenticación
│   └── financeService.ts   # Servicio específico para finanzas
```

## 🚀 Cómo Cambiar la IP del Backend

### Opción 1: Editar directamente en el código

Modifica el archivo `src/config/api.ts`:

```typescript
const API_CONFIG = {
  HOST: 'TU_NUEVA_IP',        // Cambia aquí
  PORT: 8000,                 // O el puerto que uses
  PROTOCOL: 'http',           // http o https
  // ...
}
```

### Opción 2: Usar variables de entorno (Recomendado)

1. Crea un archivo `.env.local` en la raíz del proyecto:

```bash
VITE_API_HOST=192.168.0.214
VITE_API_PORT=8000
VITE_API_PROTOCOL=http
```

2. Las variables se aplicarán automáticamente al iniciar el servidor de desarrollo.

## 🔌 Endpoints Configurados

Los siguientes endpoints están pre-configurados para tu backend Spring Boot:

### Autenticación
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/profile`
- `POST /api/v1/auth/refresh`

### Finanzas
- `GET /api/v1/finanzas/balance`
- `GET /api/v1/finanzas/transacciones`
- `POST /api/v1/finanzas/transacciones`
- `GET /api/v1/finanzas/categorias`
- `GET /api/v1/finanzas/cuentas`

### Dashboard
- `GET /api/v1/dashboard/resumen`
- `GET /api/v1/dashboard/estadisticas`

## 💡 Uso de los Servicios

### Ejemplo: Servicio de Autenticación

```typescript
import authService from '@/services/authService';

// Login
const loginData = await authService.login({
  email: 'usuario@email.com',
  password: 'password123'
});

// Verificar si está autenticado
if (authService.isAuthenticated()) {
  // Usuario logueado
}
```

### Ejemplo: Servicio de Finanzas

```typescript
import financeService from '@/services/financeService';

// Obtener balance
const balance = await financeService.getBalance();

// Obtener transacciones con filtros
const transacciones = await financeService.getTransacciones({
  fechaInicio: '2024-01-01',
  tipo: 'INGRESO'
});

// Crear nueva transacción
const nuevaTransaccion = await financeService.crearTransaccion({
  descripcion: 'Salario',
  monto: 5000,
  tipo: 'INGRESO',
  categoriaId: 1,
  cuentaId: 1
});
```

## 🛠️ Configuración del Backend Spring Boot

Para que funcione correctamente, tu backend Spring Boot debería tener:

### CORS configurado

```java
@CrossOrigin(origins = "http://localhost:5173") // URL de tu frontend
@RestController
@RequestMapping("/api/v1")
public class FinanzasController {
    // tus endpoints
}
```

### O configuración global de CORS

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*");
            }
        };
    }
}
```

## 🔍 Verificación de Conexión

El proyecto incluye una función para verificar la conexión con el backend:

```typescript
import { checkServerHealth } from '@/config/api';

const isServerAvailable = await checkServerHealth();
if (isServerAvailable) {
  console.log('✅ Servidor Spring Boot disponible');
} else {
  console.log('❌ No se puede conectar al servidor');
}
```

## 🐛 Troubleshooting

### Error de CORS
- Asegúrate de que tu backend Spring Boot tenga CORS configurado
- Verifica que la URL del frontend esté en la lista de orígenes permitidos

### Error de conexión
- Verifica que la IP y puerto sean correctos
- Asegúrate de que el backend esté ejecutándose
- Revisa el firewall de la máquina donde está el backend

### Error 404 en endpoints
- Verifica que las rutas en tu backend coincidan con las configuradas en `api.ts`
- Asegúrate de que tu backend use el prefijo `/api/v1`