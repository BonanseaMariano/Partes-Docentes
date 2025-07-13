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

## ✅ Conexión con Backend COMPLETADA

**Backend conectado:** `https://partes-docentes-1.onrender.com`

La aplicación Angular ahora puede realizar llamadas a:
- `GET /rest/divisiones`
- `POST /rest/personas`
- `PUT /rest/cargos`
- etc.

**Próximo paso:** Hacer commit y redesplegar para activar la conexión.

## Variables de entorno en Render

No se requieren variables especiales para el frontend.
