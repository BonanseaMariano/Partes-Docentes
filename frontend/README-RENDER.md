# Frontend - Despliegue en Render

## Configuración en Render

**Tipo de servicio:** Web Service

**Configuración:**
- **Repositorio:** BonanseaMariano/Partes-Docentes
- **Rama:** Render
- **Root Directory:** `frontend`
- **Runtime:** Docker
- **Dockerfile Path:** `Dockerfile.prod`

## Archivos necesarios

1. **`Dockerfile.prod`** - Construye y sirve la aplicación Angular
2. **`nginx.conf`** - Configuración para servir la SPA (proxy comentado temporalmente)

## ⚠️ Configuración del Backend

**Actualmente el proxy al backend está comentado** en `nginx.conf` para permitir que el frontend se despliegue sin errores.

**Cuando tengas el backend desplegado:**

1. Descomenta las líneas 20-26 en `nginx.conf`
2. Reemplaza `tu-backend-url.render.com` con la URL real de tu backend
3. Haz commit y push para redesplegar

```nginx
# Descomentar y actualizar cuando tengas el backend:
location /rest/ {
    proxy_pass http://TU-BACKEND-REAL-URL.render.com/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Variables de entorno en Render

No se requieren variables especiales para el frontend.
