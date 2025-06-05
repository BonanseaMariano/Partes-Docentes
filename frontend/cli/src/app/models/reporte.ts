export interface Reporte {
    Anio: number;
    Docente: DocenteInfo;
    Designaciones: DesignacionConDias[];
    EstadisticasLicencias: EstadisticasLicencias;
    Calificacion: string;
}

export interface DocenteInfo {
    DNI: number;
    Nombre: string;
    Apellido: string;
}

export interface DesignacionConDias {
    Designacion: DesignacionInfo;
    FechaInicioEnAnio: string;
    FechaFinEnAnio: string;
    DiasDesignacionEnAnio: number;
}

export interface DesignacionInfo {
    SituacionRevista: string | null;
    FechaInicio: string;
    FechaFin: string | null;
    Cargo: CargoInfo;
}

export interface CargoInfo {
    Nombre: string;
    CargaHoraria: number;
    FechaInicio: string;
    FechaFin: string | null;
    TipoDesignacion: string;
    Division: DivisionInfo;
}

export interface DivisionInfo {
    Anio: number;
    NumDivision: number;
    Orientacion: string;
    Turno: string;
}

export interface EstadisticasLicencias {
    TotalDiasLicencia: number;
    PorcentajeLicenciaAnual: number;
    LicenciasPorMes: { [mes: string]: number };
    LicenciasPorArticulo: { [articulo: string]: LicenciasPorArticulo };
}

export interface LicenciasPorArticulo {
    Descripcion: string;
    Dias: number;
    Cantidad: number;
}

// Interface para la respuesta completa del API
export interface ReporteResponse {
    data: Reporte;
    message: string;
    status: number;
}
