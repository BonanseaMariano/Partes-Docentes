import { ArticuloLicencia } from './articulo-licencia';
import { Designacion } from './designacion';
import { Estado } from './estado';
import { Log } from './log';
import { Persona } from './persona';

export interface Licencia {
    /**
     * ID de la licencia, generado automáticamente
     */
    id?: number;

    /**
     * Fecha y hora de la solicitud de la licencia
     */
    pedidoDesde: Date;

    /**
     * Fecha y hora de la finalización de la licencia
     */
    pedidoHasta: Date;

    /**
     * Domicilio de la licencia (opcional)
     */
    domicilio?: string;

    /**
     * Si la licencia cuenta con certificado médico
     */
    certificadoMedico: boolean;

    /**
     * Estado de la licencia
     */
    estado: Estado;

    /**
     * Persona que solicita la licencia
     */
    persona: Persona;

    /**
     * Designaciones asociadas a la licencia
     */
    designaciones: Designacion[];

    /**
     * Artículo de licencia asociado a la licencia
     */
    articuloLicencia: ArticuloLicencia;

    /**
     * Logs de la licencia, que contienen el historial de eventos
     */
    logs: Log[];
}