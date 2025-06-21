package unpsjb.labprog.backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Utilidad para estandarización de respuestas HTTP del sistema.
 *
 * <p>
 * Esta clase proporciona métodos estáticos para crear respuestas HTTP
 * consistentes en toda la aplicación, garantizando un formato uniforme para
 * todas las respuestas de la API REST. Centraliza la lógica de construcción de
 * respuestas y facilita el mantenimiento y evolución del formato de
 * respuesta.</p>
 *
 * <p>
 * Estructura estándar de respuesta:</p>
 * <pre>
 * {
 *   "status": 200,
 *   "message": "OK",
 *   "data": { ... }
 * }
 * </pre>
 *
 * <p>
 * Códigos de estado soportados:</p>
 * <ul>
 * <li><strong>200 OK:</strong> Operación exitosa</li>
 * <li><strong>400 BAD_REQUEST:</strong> Error en la solicitud</li>
 * <li><strong>401 UNAUTHORIZED:</strong> No autorizado</li>
 * <li><strong>404 NOT_FOUND:</strong> Recurso no encontrado</li>
 * <li><strong>422 UNPROCESSABLE_ENTITY:</strong> Entidad no procesable</li>
 * <li><strong>500 INTERNAL_SERVER_ERROR:</strong> Error del servidor</li>
 * </ul>
 *
 * @author Mariano Bonansea
 * @version 1.0
 */
public class Response {

    /**
     * Método base para construir respuestas HTTP estandarizadas.
     *
     * <p>
     * Crea una estructura de respuesta consistente con status, mensaje y datos.
     * Todos los demás métodos de esta clase utilizan este método como base.</p>
     *
     * @param status el código de estado HTTP a incluir en la respuesta
     * @param message el mensaje descriptivo de la respuesta
     * @param responseObj los datos a incluir en la respuesta (puede ser null)
     * @return ResponseEntity con la estructura estandarizada
     */
    public static ResponseEntity<Object> response(HttpStatus status, String message, Object responseObj) {
        Map<String, Object> map = new HashMap<>();

        map.put("status", status.value());
        map.put("message", message);
        map.put("data", responseObj);

        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    /**
     * Crea una respuesta de éxito con datos y mensaje por defecto.
     *
     * @param responseObj los datos a incluir en la respuesta exitosa
     * @return ResponseEntity con estado 200 OK y mensaje "OK"
     */
    public static ResponseEntity<Object> ok(Object responseObj) {
        return response(HttpStatus.OK, "OK", responseObj);
    }

    /**
     * Crea una respuesta de éxito con datos y mensaje personalizado.
     *
     * @param responseObj los datos a incluir en la respuesta exitosa
     * @param msj el mensaje personalizado para la respuesta
     * @return ResponseEntity con estado 200 OK y mensaje personalizado
     */
    public static ResponseEntity<Object> ok(Object responseObj, String msj) {
        return response(HttpStatus.OK, msj, responseObj);
    }

    /**
     * Crea una respuesta de recurso no encontrado con mensaje por defecto.
     *
     * @return ResponseEntity con estado 404 NOT_FOUND y mensaje "Not found"
     */
    public static ResponseEntity<Object> notFound() {
        return response(HttpStatus.NOT_FOUND, "Not found", null);
    }

    /**
     * Crea una respuesta de recurso no encontrado con mensaje personalizado.
     *
     * @param msj el mensaje personalizado para explicar qué no se encontró
     * @return ResponseEntity con estado 404 NOT_FOUND y mensaje personalizado
     */
    public static ResponseEntity<Object> notFound(String msj) {
        return response(HttpStatus.NOT_FOUND, msj, null);
    }

    /**
     * Crea una respuesta de error de solicitud con datos y mensaje.
     *
     * <p>
     * Utilizada para errores de validación o solicitudes mal formadas.</p>
     *
     * @param responseObj datos adicionales sobre el error (puede ser null)
     * @param msj mensaje descriptivo del error
     * @return ResponseEntity con estado 400 BAD_REQUEST
     */
    public static ResponseEntity<Object> error(Object responseObj, String msj) {
        return response(HttpStatus.BAD_REQUEST, msj, responseObj);
    }

    /**
     * Crea una respuesta de error de base de datos.
     *
     * <p>
     * Específica para errores relacionados con operaciones de base de
     * datos.</p>
     *
     * @param msj mensaje descriptivo del error de base de datos
     * @return ResponseEntity con estado 500 INTERNAL_SERVER_ERROR
     */
    public static ResponseEntity<Object> dbError(String msj) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, msj, null);
    }

    /**
     * Crea una respuesta de entidad no procesable.
     *
     * <p>
     * Utilizada cuando los datos enviados están bien formados pero no pueden
     * ser procesados debido a errores de lógica de negocio.</p>
     *
     * @param msj mensaje descriptivo del problema de procesamiento
     * @return ResponseEntity con estado 422 UNPROCESSABLE_ENTITY
     */
    public static ResponseEntity<Object> unprocessableEntity(String msj) {
        return response(HttpStatus.UNPROCESSABLE_ENTITY, msj, null);
    }

    /**
     * Crea una respuesta de no autorizado.
     *
     * <p>
     * Utilizada cuando el usuario no tiene permisos para realizar la
     * operación.</p>
     *
     * @param msj mensaje descriptivo del problema de autorización
     * @return ResponseEntity con estado 401 UNAUTHORIZED
     */
    public static ResponseEntity<Object> unauthorized(String msj) {
        return response(HttpStatus.UNAUTHORIZED, msj, null);
    }

    /**
     * Crea una respuesta de error interno del servidor.
     *
     * <p>
     * Utilizada para errores inesperados o fallos internos del sistema.</p>
     *
     * @param msj mensaje descriptivo del error interno
     * @return ResponseEntity con estado 500 INTERNAL_SERVER_ERROR
     */
    public static ResponseEntity<Object> internalServerError(String msj) {
        return response(HttpStatus.INTERNAL_SERVER_ERROR, msj, null);
    }
}
