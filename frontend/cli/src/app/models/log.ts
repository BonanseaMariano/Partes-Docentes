/**
 * Interfaz que representa un registro de evento en el sistema de auditoría.
 * 
 * Define la estructura de los logs que registran eventos significativos
 * en el sistema, proporcionando trazabilidad y auditoría de acciones
 * realizadas sobre entidades como licencias, designaciones y otros
 * elementos críticos del sistema académico.
 * 
 * @interface Log
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Log {
    /**
     * Identificador único del registro de log en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * cada evento registrado en el sistema de auditoría.
     */
    id?: number;

    /**
     * Timestamp del momento en que ocurrió el evento registrado.
     * 
     * Fecha y hora exacta del evento, utilizada para ordenamiento
     * cronológico y análisis temporal de la actividad del sistema.
     */
    fechaHora: Date;

    /**
     * Descripción textual del evento registrado.
     * 
     * Mensaje descriptivo que explica qué acción o evento específico
     * fue registrado, proporcionando contexto para auditoría y
     * seguimiento de cambios en el sistema.
     */
    descripcion: string;
}