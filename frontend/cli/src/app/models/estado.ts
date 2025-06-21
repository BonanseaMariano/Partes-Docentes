/**
 * Enumeración de estados de validación para entidades del sistema.
 * 
 * Define los estados posibles que pueden tener las solicitudes, licencias
 * y otros elementos que requieren validación administrativa en el sistema
 * académico. Proporciona un mecanismo binario simple para indicar
 * si un elemento cumple con los criterios de validación establecidos.
 * 
 * @enum Estado
 * @author Mariano Bonansea
 * @version 1.0
 */
export enum Estado {
    /** Estado que indica que la entidad cumple con todos los criterios de validación */
    VALIDO = 'VALIDO',

    /** Estado que indica que la entidad no cumple con los criterios de validación */
    INVALIDO = 'INVALIDO'
}

/**
 * Diccionario de traducciones para presentación de estados en español.
 * 
 * Mapea los valores del enum Estado a strings legibles en español
 * para mostrar en la interfaz de usuario, proporcionando una experiencia
 * más amigable y comprensible para los usuarios finales.
 * 
 * @constant EstadoLabels
 * @author Mariano Bonansea
 * @version 1.0
 */
export const EstadoLabels: Record<Estado, string> = {
    [Estado.VALIDO]: 'Válido',
    [Estado.INVALIDO]: 'Inválido'
}