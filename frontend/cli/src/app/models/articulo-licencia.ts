/**
 * Interfaz que representa un artículo reglamentario de licencia docente.
 * 
 * Define los tipos de licencias disponibles según la normativa aplicable,
 * especificando el marco legal que ampara cada tipo de ausencia docente.
 * Los artículos de licencia son la base normativa para la validación
 * y tramitación de solicitudes de licencia en el sistema académico.
 * 
 * @interface ArticuloLicencia
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface ArticuloLicencia {
    /**
     * Identificador único del artículo de licencia en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * cada tipo de licencia disponible en el marco normativo.
     */
    id?: number;

    /**
     * Código o número del artículo reglamentario.
     * 
     * Identificador textual único que referencia el artículo específico
     * de la normativa que ampara el tipo de licencia. Debe ser único
     * en el sistema para evitar ambigüedades normativas.
     */
    articulo: string;

    /**
     * Descripción detallada del artículo de licencia.
     * 
     * Texto explicativo que detalla las condiciones, alcances y
     * procedimientos específicos del tipo de licencia, facilitando
     * la comprensión de su aplicación práctica.
     */
    descripcion?: string;
}