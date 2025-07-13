# Backend - Despliegue en Render

## 📋 Configuración para Render

### 1. Base de Datos PostgreSQL

**Tipo de servicio:** PostgreSQL

**Configuración:**
- **Name:** `partes-docentes-db`
- **Database:** `labprog`
- **User:** `APP`
- **Region:** Mismo que el backend

**Importante:** Guarda la **Internal Database URL** que se genera.

### 2. Backend (Spring Boot)

**Tipo de servicio:** Web Service

**Configuración:**
- **Repositorio:** BonanseaMariano/Partes-Docentes
- **Rama:** Render
- **Root Directory:** `backend`
- **Runtime:** Docker
- **Dockerfile Path:** `Dockerfile.prod`

### 3. Variables de Entorno para el Backend

```env
# Perfil de Spring Boot
SPRING_PROFILES_ACTIVE=prod

# Base de datos (usar la Internal Database URL de Render)
DATABASE_URL=postgresql://APP:PASSWORD@HOST:5432/labprog

# URL del frontend para CORS
FRONTEND_URL=https://partes-docentes.onrender.com
```

## 🔗 Conectar Frontend con Backend

Una vez desplegado el backend, actualizar `frontend/nginx.conf`:

```nginx
# Descomentar y actualizar con la URL real del backend:
location /rest/ {
    proxy_pass https://TU-BACKEND-URL.onrender.com/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 📁 Archivos de configuración

1. **`Dockerfile.prod`** - Build y runtime optimizado para producción
2. **`application-prod.properties`** - Configuración para producción con variables de entorno
3. **`CorsConfig.java`** - Configuración CORS para permitir el frontend

## 🚀 Orden de despliegue

1. ✅ Frontend desplegado
2. 🔄 **Base de datos PostgreSQL** (crear primero)
3. 🔄 **Backend** (configurar con la DB URL)
4. 🔄 **Actualizar frontend** con URL del backend

## ⚠️ Notas importantes

- El backend usa el puerto 8080 internamente
- Render maneja automáticamente el mapeo de puertos
- Las migraciones de BD se ejecutan automáticamente con `hibernate.ddl-auto=update`
- CORS está configurado para permitir el frontend
