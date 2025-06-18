import { DiaSemana } from './horario';
import { Turno } from './turno';

/**
 * DTO para representar los horarios de espacios curriculares en una grilla semanal
 */
export interface HorarioDTO {
    /**
     * Fecha para la cual se consultan los horarios
     */
    fecha: string; // Formato yyyy-MM-dd

    /**
     * Turno del cual se muestran los horarios
     */
    turno: Turno;

    /**
     * Grilla organizada por día de la semana con los espacios curriculares
     */
    grilla: { [key in DiaSemana]: HoraEspacioCurricular[] };
}

/**
 * Representa un espacio curricular en una hora específica
 */
export interface HoraEspacioCurricular {
    /**
     * Número de hora (1 a 8)
     */
    hora: number;

    /**
     * Nombre del espacio curricular/materia
     */
    espacio_curricular: string;

    /**
     * Información de la división (año, número, orientación)
     */
    division: string;

    /**
     * Nombre completo del docente asignado
     */
    docente: string;

    /**
     * Indica si el docente está de licencia (sin reemplazo)
     */
    docente_de_licencia?: boolean;
}
