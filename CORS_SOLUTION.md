# 🚨 Solución para Error CORS

## Problema Detectado
```
Access to fetch at 'http://192.168.0.214:8080/api/users' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource
```

## ✅ Solución para tu Backend Spring Boot

Necesitas configurar CORS en tu backend para permitir peticiones desde el frontend. Aquí tienes varias opciones:

### Opción 1: Configuración Global de CORS (Recomendada)

Crea una clase de configuración en tu proyecto Spring Boot:

```java
package com.tupackage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(
                            "http://localhost:5173",           // Desarrollo local
                            "http://192.168.0.214:5173",      // Desde otras máquinas en la red
                            "http://localhost:3000"            // Por si cambias el puerto
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
```

### Opción 2: Anotación @CrossOrigin en Controladores

Añade esta anotación a tus controladores específicos:

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://192.168.0.214:5173"
})
public class UserController {
    
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        // Tu lógica aquí
        return ResponseEntity.ok().build();
    }
}
```

### Opción 3: Configuración en application.properties

Añade estas propiedades a tu `application.properties`:

```properties
# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:5173,http://192.168.0.214:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600
```

## 🔧 Configuración Específica para Spring Security

Si usas Spring Security, también necesitas configurar CORS ahí:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // ... resto de tu configuración
            ;
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://192.168.0.214:5173"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

## 🚀 Pasos para Implementar

1. **Elige una de las opciones** (recomiendo la Opción 1 - Configuración Global)
2. **Añade el código** a tu proyecto Spring Boot
3. **Reinicia tu servidor** Spring Boot
4. **Prueba el registro** desde el frontend

## 🧪 Verificar que Funciona

Después de configurar CORS, deberías poder:

1. Abrir tu frontend en `http://localhost:5173`
2. Ir a `/register`
3. Llenar el formulario de registro
4. Ver que la petición se envía correctamente a tu backend

## 📝 Notas Importantes

- **Puerto correcto**: La configuración del frontend ahora usa el puerto **8080** como tu backend
- **Origenes múltiples**: La configuración incluye tanto localhost como tu IP de red
- **Métodos HTTP**: Se permiten todos los métodos necesarios (GET, POST, PUT, DELETE, OPTIONS)
- **Credenciales**: Se permite el envío de credenciales para autenticación

## 🔍 Troubleshooting

Si después de configurar CORS sigues teniendo problemas:

1. **Verifica que el backend esté corriendo** en el puerto 8080
2. **Revisa los logs** del backend para ver si llegan las peticiones
3. **Usa las DevTools** del navegador para verificar las peticiones HTTP
4. **Verifica la URL** en la consola del navegador

## 📞 Endpoint de Registro

Tu endpoint debe estar disponible en:
```
POST http://192.168.0.214:8080/api/users
```

Con el cuerpo:
```json
{
    "username": "nombre_usuario",
    "password": "contraseña",
    "enabled": true,
    "accountNotExpired": true,
    "accountNotLocked": true,
    "credentialNotExpired": true,
    "rolesList": [
        { "id": 2 }
    ]
}
```