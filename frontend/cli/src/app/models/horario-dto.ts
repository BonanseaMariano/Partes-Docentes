import { DiaSemana } from './horario';
import { Turno } from './turno';

/**
 * DTO para representación de horarios académicos en grilla semanal.
 * 
 * Define la estructura de datos para consulta y visualización de horarios
 * de espacios curriculares organizados en una grilla semanal. Facilita
 * la presentación estructurada de la programación académica por turno
 * y permite identificar docentes de licencia sin reemplazo.
 * 
 * @interface HorarioDTO
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface HorarioDTO {
    /**
     * Fecha de referencia para la consulta de horarios.
     * 
     * Fecha específica para la cual se valida la vigencia de designaciones
     * y se determina el estado de las licencias. Formato: yyyy-MM-dd.
     */
    fecha: string; // Formato yyyy-MM-dd

    /**
     * Turno académico del cual se muestran los horarios.
     * 
     * Especifica el período del día (mañana, tarde, vespertino, noche)
     * para filtrar y organizar los espacios curriculares correspondientes.
     */
    turno: Turno;

    /**
     * Grilla semanal organizada por día con espacios curriculares.
     * 
     * Estructura de datos que mapea cada día de la semana con su
     * correspondiente lista de espacios curriculares y docentes asignados,
     * facilitando la visualización en formato de grilla académica.
     */
    grilla: { [key in DiaSemana]: HoraEspacioCurricular[] };
}

/**
 * Interfaz que representa un espacio curricular en un bloque horario específico.
 * 
 * Define la información completa de una asignación académica en un momento
 * determinado, incluyendo la materia, división, docente responsable y
 * estado de licencia. Es la unidad básica de información en la grilla horaria.
 * 
 * @interface HoraEspacioCurricular
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface HoraEspacioCurricular {
    /**
     * Número del bloque horario en la jornada académica.
     * 
     * Identifica el período específico (1 a 8) en que se desarrolla
     * el espacio curricular durante el día académico.
     */
    hora: number;

    /**
     * Denominación del espacio curricular o materia.
     * 
     * Nombre oficial de la asignatura que se imparte en este
     * bloque horario específico.
     */
    espacio_curricular: string;

    /**
     * Información descriptiva de la división académica.
     * 
     * Texto que identifica la división (año, número, orientación)
     * donde se desarrolla el espacio curricular.
     */
    division: string;

    /**
     * Nombre completo del docente asignado al espacio curricular.
     * 
     * Identificación del profesional responsable de impartir
     * la materia en este horario específico. Puede ser null
     * si no hay docente asignado.
     */
    docente: string | null;

    /**
     * Indicador de licencia docente sin reemplazo.
     * 
     * Flag que señala si el docente asignado está de licencia
     * sin contar con un reemplazante, requiriendo atención especial
     * para la continuidad académica.
     */
    docente_de_licencia?: boolean;

    /**
     * Indicador de asignación docente.
     * 
     * Flag que señala si el espacio curricular tiene un docente
     * asignado. Útil para identificar materias que requieren
     * designación de personal.
     */
    tiene_docente_asignado?: boolean;
}
