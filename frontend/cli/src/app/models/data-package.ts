/**
 * Interfaz estándar para respuestas del backend en el sistema.
 * 
 * Define la estructura común de todas las respuestas HTTP del backend,
 * proporcionando un formato consistente para el manejo de datos,
 * mensajes de estado y códigos de respuesta en toda la aplicación.
 * 
 * @interface DataPackage
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface DataPackage {
    /** Código de estado HTTP de la respuesta */
    status: number;
    /** Mensaje descriptivo del resultado de la operación */
    message: string;
    /** Datos de respuesta (puede ser objeto, array, primitivo, etc.) */
    data: object;
}