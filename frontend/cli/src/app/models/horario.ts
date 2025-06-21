/**
 * Interfaz que representa un bloque horario específico en la programación académica.
 * 
 * Define un slot temporal concreto en la grilla semanal de horarios,
 * especificando día de la semana y período horario. Los horarios son
 * elementos fundamentales para la organización temporal de espacios
 * curriculares y cargos docentes en el sistema académico.
 * 
 * @interface Horario
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Horario {
    /**
     * Identificador único del horario en el sistema.
     * 
     * Clave primaria autoincremental que identifica unívocamente
     * cada bloque horario en la programación académica.
     */
    id?: number;

    /**
     * Día de la semana del bloque horario.
     * 
     * Especifica en qué día de la semana se desarrolla la actividad,
     * utilizando la enumeración DiaSemana para consistencia.
     */
    dia: DiaSemana;

    /**
     * Número del período horario dentro del día.
     * 
     * Representa un bloque horario numerado del 1 al 8, donde cada
     * número corresponde a un período específico de tiempo durante
     * la jornada académica (ej: 1=primera hora, 2=segunda hora).
     */
    hora: number;
}

/**
 * Enumeración de días de la semana para programación académica.
 * 
 * Define los días hábiles y no hábiles disponibles para programación
 * de actividades académicas. Utilizada como referencia estándar
 * en todo el sistema para mantener consistencia en horarios.
 * 
 * @enum DiaSemana
 * @author Mariano Bonansea
 * @version 1.0
 */
export enum DiaSemana {
    /** Lunes - Primer día hábil de la semana académica */
    LUNES = 'LUNES',

    /** Martes - Segundo día hábil de la semana académica */
    MARTES = 'MARTES',

    /** Miércoles - Tercer día hábil de la semana académica */
    MIERCOLES = 'MIERCOLES',

    /** Jueves - Cuarto día hábil de la semana académica */
    JUEVES = 'JUEVES',

    /** Viernes - Quinto día hábil de la semana académica */
    VIERNES = 'VIERNES',

    /** Sábado - Sexto día, disponible para actividades especiales */
    SABADO = 'SABADO',

    /** Domingo - Séptimo día, generalmente no hábil */
    DOMINGO = 'DOMINGO'
}

/**
 * Diccionario de traducciones para presentación de días en español.
 * 
 * Mapea los valores del enum DiaSemana a strings legibles en español
 * para mostrar en la interfaz de usuario, manteniendo consistencia
 * visual y mejorando la experiencia del usuario final.
 * 
 * @constant DiaSemanaLabels
 * @author Mariano Bonansea
 * @version 1.0
 */
export const DiaSemanaLabels: Record<DiaSemana, string> = {
    [DiaSemana.LUNES]: 'Lunes',
    [DiaSemana.MARTES]: 'Martes',
    [DiaSemana.MIERCOLES]: 'Miércoles',
    [DiaSemana.JUEVES]: 'Jueves',
    [DiaSemana.VIERNES]: 'Viernes',
    [DiaSemana.SABADO]: 'Sábado',
    [DiaSemana.DOMINGO]: 'Domingo'
}

/**
 * Enumeración legacy de días con valores en español.
 * 
 * Se mantiene por compatibilidad con código existente que pueda
 * referenciar esta enumeración. Se recomienda migrar gradualmente
 * al uso de DiaSemana y DiaSemanaLabels para mayor consistencia.
 * 
 * @enum Dia
 * @deprecated Usar DiaSemana y DiaSemanaLabels en su lugar
 * @author Mariano Bonansea
 * @version 1.0
 */
export enum Dia {
    LUNES = 'Lunes',
    MARTES = 'Martes',
    MIERCOLES = 'Miércoles',
    JUEVES = 'Jueves',
    VIERNES = 'Viernes',
    SABADO = 'Sábado',
    DOMINGO = 'Domingo'
}