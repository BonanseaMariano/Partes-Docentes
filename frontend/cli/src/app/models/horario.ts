export interface Horario {
    /**
     * ID del horario, generado automáticamente
     */
    id?: number;

    /**
     * Día de la semana del horario
     */
    dia: string;

    /**
     * Hora del horario
     */
    hora: number;
}

export enum Dia {
    LUNES = 'Lunes',
    MARTES = 'Martes',
    MIERCOLES = 'Miércoles',
    JUEVES = 'Jueves',
    VIERNES = 'Viernes',
    SABADO = 'Sábado',
    DOMINGO = 'Domingo'
}