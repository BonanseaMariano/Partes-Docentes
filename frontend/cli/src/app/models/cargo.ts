import { Division } from './division';
import { Horario } from './horario';
import { TipoDesignacion } from './tipo-designacion';

export interface Cargo {
    /**
     * Identificador único del cargo generado automáticamente.
     */
    id: number;

    /**
     * Nombre o título del cargo.
     */
    nombre: string;

    /**
     * Carga horaria semanal asignada al cargo en horas.
     */
    cargaHoraria: number;

    /**
     * Fecha de inicio de vigencia del cargo.
     */
    fechaInicio: Date;

    /**
     * Fecha de finalización de vigencia del cargo.
     */
    fechaFin?: Date;

    /**
     * Tipo de designación del cargo (ej. suplente, titular, interino).
     */
    tipoDesignacion: TipoDesignacion;

    /**
     * División a la que pertenece el cargo, si corresponde a un espacio curricular.
     */
    division?: Division;

    /**
     * Colección de horarios asignados a este cargo.
     */
    horarios: Horario[];
}

