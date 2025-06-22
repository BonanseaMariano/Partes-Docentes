import { Persona } from './persona';
import { Cargo } from './cargo';

/**
 * Interfaz que representa una designación docente en el sistema académico.
 * 
 * Establece la relación entre una persona y un cargo específico durante
 * un período determinado. Las designaciones son el núcleo del sistema
 * de gestión de recursos humanos docentes, definiendo quién, dónde y
 * cuándo se desarrolla una función académica específica.
 * 
 * @interface Designacion
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Designacion {
    /**
     * Identificador único de la designación en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * cada relación persona-cargo en el tiempo.
     */
    id: number;

    /**
     * Situación de revista del docente en la designación.
     * 
     * Clasificación administrativa que indica el tipo de nombramiento
     * del docente (ej: "Titular", "Suplente", "Interino", "Provisional").
     * Determina estabilidad laboral y derechos correspondientes.
     */
    situacionRevista?: string;

    /**
     * Fecha de inicio de vigencia de la designación.
     * 
     * Momento a partir del cual la persona asume formalmente
     * las responsabilidades del cargo asignado. Formato: YYYY-MM-DD
     * o objeto Date.
     */
    fechaInicio: Date | string;

    /**
     * Fecha de finalización de la designación.
     * 
     * Momento hasta el cual la persona mantiene la designación.
     * Si no se especifica, la designación tiene duración indefinida.
     * Formato: YYYY-MM-DD o objeto Date.
     */
    fechaFin?: Date | string;

    /**
     * Persona designada en el cargo.
     * 
     * Referencia completa al docente que recibe la designación,
     * incluyendo todos sus datos personales y otras designaciones
     * que pueda tener en el sistema.
     */
    persona: Persona;

    /**
     * Cargo asignado en la designación.
     * 
     * Referencia completa al cargo o espacio curricular que se asigna,
     * incluyendo información sobre horarios, división asociada y
     * características específicas del puesto.
     */
    cargo: Cargo;
}

