# Backend - Despliegue en Render

## 📋 Configuración para Render

### 1. Base de Datos PostgreSQL

**Crear servicio PostgreSQL:**
1. En Render Dashboard → New → PostgreSQL
2. **Name:** `partes-docentes-db`
3. **Database:** `labprog`
4. **User:** `APP`
5. **Region:** Mismo que el backend
6. Crear y esperar que esté disponible

### 2. Backend (Spring Boot)

**Crear Web Service:**
1. New → Web Service
2. **Repositorio:** BonanseaMariano/Partes-Docentes
3. **Rama:** Render
4. **Root Directory:** `backend`
5. **Runtime:** Docker
6. **Dockerfile Path:** `Dockerfile.prod`

### 3. Variables de Entorno

**Solo necesitas configurar estas 2 variables:**

```env
# Perfil de Spring Boot
SPRING_PROFILES_ACTIVE=prod

# URL del frontend para CORS
FRONTEND_URL=https://partes-docentes.onrender.com
```

### 4. Conectar Base de Datos

**En el Web Service del backend:**
1. Ve a la pestaña **Environment**
2. En la sección **"Add from Database"**
3. Selecciona tu base de datos `partes-docentes-db`
4. Render automáticamente agregará la variable `DATABASE_URL`

**✅ FÁCIL:** La clase `DatabaseConfig.java` convierte automáticamente la `DATABASE_URL` de Render al formato que Spring Boot necesita.

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
2. **`application-prod.properties`** - Configuración para producción
3. **`DatabaseConfig.java`** - Convierte automáticamente DATABASE_URL de Render
4. **`CorsConfig.java`** - Configuración CORS para permitir el frontend

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
