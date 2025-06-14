import { Persona } from './persona';
import { Cargo } from './cargo';

export interface Designacion {
    /**
     * ID de la designación
     */
    id: number;

    /**
     * Situación de la revista de la persona
     */
    situacionRevista?: string;

    /**
     * Fecha de inicio de la designación (formato: YYYY-MM-DD)
     */
    fechaInicio: Date | string;

    /**
     * Fecha de finalización de la designación (formato: YYYY-MM-DD)
     */
    fechaFin?: Date | string;

    /**
     * Persona a la que se le asigna la designación
     */
    persona: Persona;

    /**
     * Cargo al que se le asigna la designación
     */
    cargo: Cargo;
}

