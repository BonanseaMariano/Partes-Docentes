export interface Log {
    /**
     * ID del log, generado automáticamente
     */
    id?: number;

    /**
     * Fecha y hora del evento registrado en el log
     */
    fechaHora: Date;

    /**
     * Descripción del evento registrado en el log
     */
    descripcion: string;
}