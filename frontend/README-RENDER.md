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
2. **`nginx.conf`** - Configuración para servir la SPA y proxy al backend

## Importante

- Cuando despliegues el backend, actualiza la URL en `nginx.conf` línea 21:
  ```
  proxy_pass http://TU-BACKEND-URL.render.com/;
  ```

- El frontend estará disponible en la URL que te asigne Render

## Variables de entorno en Render

No se requieren variables especiales para el frontend.
