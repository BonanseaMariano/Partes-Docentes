import { Turno } from "./turno";

export interface Division {
    /**
     * ID de la división
     */
    id: number;

    /**
     * Año de la división
     */
    anio: number;

    /**
     * Numero de la división
     */
    numDivision: number;

    /**
     * Orientación de la división (opcional)
     */
    orientacion?: string;

    /**
     * Turno de la división
     */
    turno: Turno;
}

