import { ArticuloLicencia } from './articulo-licencia';
import { Designacion } from './designacion';
import { Estado } from './estado';
import { Log } from './log';
import { Persona } from './persona';

/**
 * Interfaz que representa una solicitud de licencia docente en el sistema.
 * 
 * Define la estructura completa de las licencias que pueden solicitar
 * los docentes, incluyendo período solicitado, justificación médica,
 * estado de tramitación y relaciones con designaciones afectadas.
 * Las licencias son elementos centrales para la gestión de ausencias
 * y cobertura docente en el sistema académico.
 * 
 * @interface Licencia
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Licencia {
    /**
     * Identificador único de la licencia en el sistema.
     * 
     * Clave primaria autoincremental generada automáticamente
     * para identificar unívocamente cada solicitud de licencia.
     */
    id?: number;

    /**
     * Fecha de inicio del período de licencia solicitado.
     * 
     * Primer día en que el docente solicita estar ausente
     * de sus obligaciones académicas. Formato: YYYY-MM-DD
     * o objeto Date.
     */
    pedidoDesde: Date | string;

    /**
     * Fecha de finalización del período de licencia solicitado.
     * 
     * Último día de ausencia solicitada. Determina la duración
     * total de la licencia para cálculos administrativos.
     * Formato: YYYY-MM-DD o objeto Date.
     */
    pedidoHasta: Date | string;

    /**
     * Indica si la licencia cuenta con respaldo de certificado médico.
     * 
     * Flag que determina si la solicitud está justificada por
     * documentación médica oficial, condicionando su tramitación
     * y validación administrativa.
     */
    certificadoMedico: boolean;

    /**
     * Estado actual de tramitación de la licencia.
     * 
     * Indica la fase del proceso administrativo en que se encuentra
     * la solicitud (ej: Pendiente, Aprobada, Rechazada, En Revisión).
     */
    estado: Estado;

    /**
     * Docente solicitante de la licencia.
     * 
     * Referencia completa a la persona que formula la solicitud,
     * incluyendo todos sus datos personales y designaciones activas
     * en el momento de la solicitud.
     */
    persona: Persona;

    /**
     * Designaciones académicas afectadas por la licencia.
     * 
     * Lista de todas las designaciones activas del docente que
     * se verán impactadas durante el período de licencia,
     * requiriendo cobertura o reorganización académica.
     */
    designaciones: Designacion[];

    /**
     * Artículo reglamentario que ampara la licencia.
     * 
     * Referencia al marco normativo específico que justifica
     * y regula el tipo de licencia solicitada, determinando
     * condiciones, plazos y procedimientos aplicables.
     */
    articuloLicencia: ArticuloLicencia;

    /**
     * Historial de eventos y cambios de estado de la licencia.
     * 
     * Registro cronológico de todas las acciones realizadas
     * sobre la solicitud, incluyendo cambios de estado, observaciones
     * y decisiones administrativas para trazabilidad completa.
     */
    logs: Log[];
}