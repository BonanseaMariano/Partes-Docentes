/**
 * Enumeración de tipos de designación docente en el sistema académico.
 * 
 * Define las categorías principales de designaciones que pueden asignarse
 * a los docentes, diferenciando entre cargos directivos/administrativos
 * y espacios curriculares específicos. Cada tipo tiene reglas de validación
 * y comportamientos particulares en el sistema de gestión.
 * 
 * @enum TipoDesignacion
 * @author Mariano Bonansea
 * @version 1.0
 */
export enum TipoDesignacion {
    /** Designación en cargo directivo o administrativo (ej: Director, Secretario) */
    CARGO = 'CARGO',

    /** Designación en espacio curricular específico (ej: Matemática, Lengua) */
    ESPACIO_CURRICULAR = 'ESPACIO_CURRICULAR',
}