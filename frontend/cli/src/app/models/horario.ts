export interface Horario {
    /**
     * ID del horario, generado automáticamente
     */
    id?: number;

    /**
     * Día de la semana del horario
     */
    dia: DiaSemana;

    /**
     * Hora del horario (1 a 8)
     * Representa un bloque horario numerado del 1 al 8
     */
    hora: number;
}

export enum DiaSemana {
    LUNES = 'LUNES',
    MARTES = 'MARTES',
    MIERCOLES = 'MIERCOLES',
    JUEVES = 'JUEVES',
    VIERNES = 'VIERNES',
    SABADO = 'SABADO',
    DOMINGO = 'DOMINGO'
}

/**
 * Traducciones para mostrar los días en español
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

// Se mantiene el enum Dia por compatibilidad con código existente
export enum Dia {
    LUNES = 'Lunes',
    MARTES = 'Martes',
    MIERCOLES = 'Miércoles',
    JUEVES = 'Jueves',
    VIERNES = 'Viernes',
    SABADO = 'Sábado',
    DOMINGO = 'Domingo'
}