import { Reporte } from './reporte';

/**
 * Interfaz que contiene estadísticas generales agregadas de todos los docentes.
 * 
 * Proporciona métricas consolidadas de designaciones y licencias a nivel
 * institucional para un año específico, facilitando análisis macro de
 * la gestión de recursos humanos docentes y patrones de ausentismo.
 * 
 * @interface EstadisticasGenerales
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface EstadisticasGenerales {
    /** Número total de designaciones activas durante el año */
    TotalDesignaciones: number;

    /** Número total de licencias solicitadas durante el año */
    TotalLicencias: number;

    /** Cantidad de licencias que no tuvieron docente suplente asignado */
    LicenciasSinSuplente: number;

    /** Suma total de días de licencia de todos los docentes */
    TotalDiasLicencias: number;

    /** Distribución de licencias agrupadas por artículo normativo */
    LicenciasPorArticulo: { [articulo: string]: number };

    /** Total de días de licencia por cada tipo de artículo */
    DiasLicenciasPorArticulo: { [articulo: string]: number };

    /** Promedio de licencias por designación en el período */
    PromedioLicenciasPorDesignacion: number;

    /** Porcentaje de días de licencia respecto al total de días hábiles anuales */
    PorcentajeDiasLicenciaAnual: number;
}

/**
 * Interfaz principal que representa un reporte consolidado anual de conceptos docentes.
 * 
 * Define la estructura del reporte institucional que incluye estadísticas
 * generales de todos los docentes, distribución temporal de licencias,
 * calificación institucional general y reportes individuales de cada docente.
 * Es el documento central para evaluación institucional y toma de decisiones.
 * 
 * @interface ReporteConcepto
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface ReporteConcepto {
    /** Año del período reportado */
    Anio: number;

    /** Estadísticas consolidadas de toda la institución */
    EstadisticasGenerales: EstadisticasGenerales;

    /** Distribución mensual de días de licencia a nivel institucional */
    DistribucionDiasLicencias: { [mes: string]: number };

    /** Calificación general del desempeño institucional en gestión docente */
    CalificacionGeneral: string;

    /** Lista completa de reportes individuales de todos los docentes */
    ReportesDocentes: Reporte[];
}
