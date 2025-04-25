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
    situacionRevista: string;

    /**
     * Fecha y hora de inicio de la designación
     */
    fechaInicio?: Date;

    /**
     * Fecha y hora de finalización de la designación
     */
    fechaFin?: Date;

    /**
     * Persona a la que se le asigna la designación
     */
    persona: Persona;

    /**
     * Cargo al que se le asigna la designación
     */
    cargo: Cargo;
}

