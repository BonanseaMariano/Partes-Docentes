/**
 * Interfaz principal que representa un reporte anual completo de un docente.
 * 
 * Define la estructura del reporte integral que incluye información
 * personal del docente, sus designaciones durante el año, estadísticas
 * de licencias y calificación general. Es el documento central para
 * evaluación y seguimiento del desempeño docente anual.
 * 
 * @interface Reporte
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface Reporte {
    /** Año del período reportado */
    Anio: number;

    /** Información personal básica del docente */
    Docente: DocenteInfo;

    /** Lista de designaciones del docente durante el año con días trabajados */
    Designaciones: DesignacionConDias[];

    /** Estadísticas detalladas de licencias tomadas durante el año */
    EstadisticasLicencias: EstadisticasLicencias;

    /** Calificación general del desempeño docente en el período */
    Calificacion: string;
}

/**
 * Interfaz que contiene la información personal básica del docente.
 * 
 * Define los datos identificatorios mínimos necesarios para
 * la identificación del docente en reportes y documentación oficial.
 * 
 * @interface DocenteInfo
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface DocenteInfo {
    /** Documento Nacional de Identidad del docente */
    DNI: number;

    /** Nombre de pila del docente */
    Nombre: string;

    /** Apellido del docente */
    Apellido: string;
}

/**
 * Interfaz que representa una designación con cálculo de días trabajados.
 * 
 * Combina información de la designación con el cálculo específico
 * de días efectivamente trabajados durante el año reportado,
 * considerando fechas de inicio, fin y períodos de vigencia.
 * 
 * @interface DesignacionConDias
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface DesignacionConDias {
    /** Información detallada de la designación */
    Designacion: DesignacionInfo;

    /** Fecha de inicio de la designación dentro del año reportado */
    FechaInicioEnAnio: string;

    /** Fecha de finalización de la designación dentro del año reportado */
    FechaFinEnAnio: string;

    /** Número total de días que la designación estuvo activa en el año */
    DiasDesignacionEnAnio: number;
}

/**
 * Interfaz que contiene información detallada de una designación.
 * 
 * Define todos los aspectos relevantes de una designación docente,
 * incluyendo situación de revista, vigencia y cargo asignado.
 * 
 * @interface DesignacionInfo
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface DesignacionInfo {
    /** Situación de revista del docente (Titular, Suplente, Interino, etc.) */
    SituacionRevista: string | null;

    /** Fecha de inicio de la designación */
    FechaInicio: string;

    /** Fecha de finalización de la designación (null si es indefinida) */
    FechaFin: string | null;

    /** Información completa del cargo asignado */
    Cargo: CargoInfo;
}

/**
 * Interfaz que contiene información completa de un cargo.
 * 
 * Define todos los aspectos del cargo o espacio curricular asignado,
 * incluyendo características académicas y división asociada.
 * 
 * @interface CargoInfo
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface CargoInfo {
    /** Nombre o denominación del cargo */
    Nombre: string;

    /** Carga horaria semanal del cargo */
    CargaHoraria: number;

    /** Fecha de inicio de vigencia del cargo */
    FechaInicio: string;

    /** Fecha de finalización de vigencia del cargo (null si es indefinida) */
    FechaFin: string | null;

    /** Tipo de designación (CARGO o ESPACIO_CURRICULAR) */
    TipoDesignacion: string;

    /** Información de la división asociada (si aplica) */
    Division: DivisionInfo;
}

/**
 * Interfaz que contiene información de una división académica.
 * 
 * Define la estructura organizacional de la división donde se
 * desarrolla el espacio curricular o cargo.
 * 
 * @interface DivisionInfo
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface DivisionInfo {
    /** Año de estudio de la división */
    Anio: number;

    /** Número de la división dentro del año */
    NumDivision: number;

    /** Orientación académica de la división */
    Orientacion: string;

    /** Turno de funcionamiento de la división */
    Turno: string;
}

/**
 * Interfaz que contiene estadísticas completas de licencias del docente.
 * 
 * Proporciona análisis cuantitativo y distribución temporal de las
 * licencias tomadas por el docente durante el año reportado,
 * facilitando evaluación de patrones de ausentismo.
 * 
 * @interface EstadisticasLicencias
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface EstadisticasLicencias {
    /** Total de días de licencia tomados en el año */
    TotalDiasLicencia: number;

    /** Porcentaje de días de licencia respecto al total anual */
    PorcentajeLicenciaAnual: number;

    /** Distribución de licencias por mes del año */
    LicenciasPorMes: { [mes: string]: number };

    /** Detalle de licencias agrupadas por artículo normativo */
    LicenciasPorArticulo: { [articulo: string]: LicenciasPorArticulo };
}

/**
 * Interfaz que detalla licencias por tipo de artículo normativo.
 * 
 * Proporciona información específica sobre un tipo de licencia,
 * incluyendo descripción, días totales y cantidad de solicitudes.
 * 
 * @interface LicenciasPorArticulo
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface LicenciasPorArticulo {
    /** Descripción del tipo de licencia */
    Descripcion: string;

    /** Total de días de licencia de este tipo */
    Dias: number;

    /** Cantidad de solicitudes de licencia de este tipo */
    Cantidad: number;
}

/**
 * Interfaz para la respuesta completa del API de reportes.
 * 
 * Define la estructura de respuesta estándar que incluye
 * el reporte y metadatos de la operación.
 * 
 * @interface ReporteResponse
 * @author Mariano Bonansea
 * @version 1.0
 */
export interface ReporteResponse {
    /** Datos del reporte generado */
    data: Reporte;

    /** Mensaje descriptivo de la operación */
    message: string;

    /** Código de estado HTTP de la respuesta */
    status: number;
}
