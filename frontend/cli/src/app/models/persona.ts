import { Designacion } from './designacion';

export interface Persona {
    /**
     * DNI de la persona, es su identificador
     */
    dni: number;

    /**
     * CUIL de la persona, es único y no nulo
     */
    cuil: string;

    /**
     * Nombre de la persona, no nulo
     */
    nombre: string;

    /**
     * Apellido de la persona, no nulo
     */
    apellido: string;

    /**
     * Título de la persona (opcional)
     */
    titulo?: string;

    /**
     * Sexo de la persona (opcional)
     */
    sexo?: string;

    /**
     * Domicilio de la persona (opcional)
     */
    domicilio?: string;

    /**
     * Teléfono de la persona (opcional)
     */
    telefono?: string;

    /**
     * Designaciones asociadas a la persona
     */
    designaciones: Designacion[];
}